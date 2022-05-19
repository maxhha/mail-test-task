from django.contrib.auth import get_user_model, login
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from recordkeeper.models import RecordBookShortLink
from recordkeeper.utils import random_string

User = get_user_model()


@ api_view(['POST'])
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
