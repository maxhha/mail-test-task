from django.contrib.auth import get_user_model
from rest_framework import permissions

from recordkeeper.models import Book

User = get_user_model()


def is_user_has_permission_over_book(book_pk, user_pk):
    try:
        book = Book.objects.get(pk=book_pk)
    except Book.DoesNotExist:
        return False

    try:
        book.users.get(pk=user_pk)
    except User.DoesNotExist:
        return False

    return True


class IsBookUserPermission(permissions.BasePermission):
    """
    Checks if user is listed in book users
    """

    def has_permission(self, request, view):
        book_pk = request.resolver_match.kwargs['book_pk']
        user_pk = request.user.id

        return is_user_has_permission_over_book(book_pk, user_pk)
