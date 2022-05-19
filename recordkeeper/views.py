from django.http import JsonResponse
from django.contrib.auth import get_user_model, login
from django.contrib.auth.decorators import login_required
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from recordkeeper.models import RecordBook, RecordBookShortLink
from recordkeeper.serializers import RecordBookSerializer
from recordkeeper.utils import random_string

User = get_user_model()


@api_view(['POST'])
def shortlink_share(request, pk):
    """
    Creates user with access for referenced record book in given short link and login
    """
    try:
        short_link = RecordBookShortLink.objects.get(pk=pk)
    except RecordBookShortLink.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if not request.user.is_authenticated:
        username = f'guest-{random_string(15)}'
        user = User.objects.create(username=username)
        login(request, user)

    short_link.book.users.add(request.user)

    return Response(status=status.HTTP_200_OK)


@login_required
@api_view(['GET', 'POST'])
def books_list(request):
    if request.method == 'GET':
        books = RecordBook.objects.filter(users=request.user)

        serializer = RecordBookSerializer(books, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        book = RecordBook.objects.create()
        book.users.add(request.user)

        serializer = RecordBookSerializer(book)
        return JsonResponse(serializer.data, safe=False)
