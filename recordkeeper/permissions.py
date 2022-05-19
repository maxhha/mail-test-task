from django.contrib.auth import get_user_model
from rest_framework import permissions

from recordkeeper.models import Book

User = get_user_model()


class IsBookUserPermission(permissions.BasePermission):
    """
    Checks if user is listed in book users
    """

    def has_permission(self, request, view):
        book_pk = request.resolver_match.kwargs['book_pk']
        try:
            book = Book.objects.get(pk=book_pk)
        except Book.DoesNotExist:
            return False

        try:
            book.users.get(pk=request.user.id)
        except User.DoesNotExist:
            return False

        return True
