import os
from django.http import FileResponse, HttpResponseForbidden, JsonResponse
from django.contrib.auth import get_user_model, login
from django.contrib.auth.decorators import login_required
from django.core.files.storage import default_storage
from rest_framework import status, authentication, permissions, viewsets
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.pagination import CursorPagination
from mailtesttask.settings import MEDIA_ROOT, FALLBACK_MEDIA_PATH

from recordkeeper.models import Book, ShortLink, Record
from recordkeeper.permissions import IsBookUserPermission
from recordkeeper.serializers import BookSerializer, RecordSerializer
from recordkeeper.utils import random_string

User = get_user_model()


@api_view(['POST'])
def shortlink_share(request, pk):
    """
    Creates user with access for referenced record book in given short link and login
    """
    try:
        short_link = ShortLink.objects.get(pk=pk)
    except ShortLink.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    response_status = status.HTTP_200_OK

    if not request.user.is_authenticated:
        username = f'guest-{random_string(15)}'
        user = User.objects.create(username=username)
        login(request, user)
        response_status = status.HTTP_201_CREATED

    short_link.book.users.add(request.user)

    serializer = BookSerializer(short_link.book)
    return JsonResponse(serializer.data, safe=False, status=response_status)


class BookViewSet(viewsets.ViewSet):
    lookup_value_regex = '[0-9]+'
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        books = Book.objects.filter(users=request.user)

        serializer = BookSerializer(books, many=True)
        return JsonResponse(serializer.data, safe=False)

    def create(self, request):
        book = Book.objects.create()
        book.users.add(request.user)

        serializer = BookSerializer(book)
        return JsonResponse(serializer.data, safe=False)


class RecordPagination(CursorPagination):
    ordering = "-created_at"


class RecordViewSet(viewsets.ModelViewSet):
    lookup_value_regex = '[0-9]+'
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated, IsBookUserPermission]
    pagination_class = RecordPagination
    serializer_class = RecordSerializer

    def get_queryset(self):
        book_pk = self.request.resolver_match.kwargs['book_pk']
        records = Record.objects.filter(book=book_pk)
        return records

    def create(self, request, book_pk=None):
        if 'book' in request.data and request.data['book'] != book_pk:
            return Response(status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        data['book'] = book_pk

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


@login_required
def media_access(request, path):
    access_granted = False

    if request.user.is_staff:
        access_granted = True

    if not access_granted:
        try:
            record = Record.objects.get(image=path)
            record.book.users.get(pk=request.user.id)
            access_granted = True
        except Record.DoesNotExist:
            pass
        except User.DoesNotExist:
            pass

    if access_granted:
        try:
            f = open(os.path.join(MEDIA_ROOT, path), "rb")
        except FileNotFoundError:
            f = open(FALLBACK_MEDIA_PATH, "rb")

            response = FileResponse(f)
        return response

    return HttpResponseForbidden('Not authorized to access this media.')
