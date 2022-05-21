import os
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db import IntegrityError
from django.conf import settings
from django.http import FileResponse, HttpResponseForbidden, JsonResponse
from django.contrib.auth import get_user_model, login
from django.contrib.auth.decorators import login_required
from rest_framework import status, authentication, permissions, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.pagination import CursorPagination
from mailtesttask.settings import MEDIA_ROOT, FALLBACK_MEDIA_PATH

from recordkeeper.models import Book, ShortLink, Record
from recordkeeper.permissions import IsBookUserPermission, isBookOwnerPermission
from recordkeeper.serializers import BookSerializer, RecordSerializer
from recordkeeper.utils import random_string
from django.db import transaction

CREATE_TRIES_LIMIT = 10


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
        for _ in range(CREATE_TRIES_LIMIT):
            username = f'guest-{random_string(15)}'
            try:
                user = User.objects.create(username=username)
                break
            except IntegrityError as e:
                if not 'duplicate key value violates unique constraint "auth_user_username_key"' in str(e):
                    raise e
        else:
            return Response(data='Username conflicts', status=status.HTTP_409_CONFLICT)

        login(request, user)
        response_status = status.HTTP_201_CREATED

    with transaction.atomic():
        short_link.book.users.add(request.user)
        if settings.PERMOMENT_SHORT_LINKS:
            short_link.delete()

    serializer = BookSerializer(short_link.book, context={"request": request})
    return JsonResponse(serializer.data, safe=False, status=response_status)


@api_view(['POST'])
@permission_classes([isBookOwnerPermission])
def book_share(request, book_pk):
    """
    Creates shortlink to a book
    """
    book = Book.objects.get(pk=book_pk)
    shortlink = ShortLink.objects.create(book=book)

    return JsonResponse({"link": shortlink.get_absolute_url()}, safe=False, status=status.HTTP_201_CREATED)


class BookViewSet(viewsets.ViewSet):
    lookup_value_regex = '[0-9]+'
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        books = Book.objects.filter(users=request.user)

        serializer = BookSerializer(
            books, many=True, context={'request': request})
        return JsonResponse(serializer.data, safe=False)

    def create(self, request):
        book = Book.objects.create(owner=request.user)
        book.users.add(request.user)

        serializer = BookSerializer(book, context={'request': request})
        return JsonResponse(serializer.data, safe=False)

    def retrieve(self, request, pk=None):
        try:
            book = Book.objects.get(pk=pk, users=request.user)
        except Book.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = BookSerializer(book, context={'request': request})
        return JsonResponse(serializer.data, safe=False)


class RecordPagination(CursorPagination):
    ordering = "-created_at"

    def encode_cursor(self, cursor):
        link = super().encode_cursor(cursor)

        if settings.USE_HTTPS:
            return link.replace("http://", "https://")
        else:
            return link


class RecordViewSet(viewsets.ModelViewSet):
    lookup_value_regex = '[0-9]+'
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [IsBookUserPermission]
    pagination_class = RecordPagination
    serializer_class = RecordSerializer

    def get_queryset(self):
        book_pk = self.request.resolver_match.kwargs['book_pk']
        records = Record.objects.filter(book=book_pk)
        return records

    def create(self, request, book_pk=None):
        if 'book' in request.data and request.data['book'] != book_pk:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer, book_pk)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer, book_pk):
        book = Book.objects.get(pk=book_pk)
        record = serializer.save(book=book)

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'book_{record.book.id}',
            {
                "type": "record_created",
                "data": serializer.data,
                "record": record,
            }
        )

    def perform_update(self, serializer):
        record = serializer.save()

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'book_{record.book.id}',
            {
                "type": "record_updated",
                "sessionid": self.request.session.session_key,
                "data": serializer.data,
                "record": record,
            }
        )


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

    if not access_granted:
        return HttpResponseForbidden('Not authorized to access this media.')

    try:
        f = open(os.path.join(MEDIA_ROOT, path), "rb")
    except FileNotFoundError:
        f = open(FALLBACK_MEDIA_PATH, "rb")

    response = FileResponse(f)
    return response
