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


class IsBookUserPermission(permissions.IsAuthenticated):
    """
    Checks if user is listed in book users
    """

    def has_permission(self, request, view):
        if not super(permissions.IsAuthenticated, self).has_permission(request, view):
            return False

        book_pk = request.resolver_match.kwargs['book_pk']
        user_pk = request.user.id

        return is_user_has_permission_over_book(book_pk, user_pk)


class isBookOwnerPermission(permissions.IsAuthenticated):
    """
    Checks if user is listed in book owner
    """

    def has_permission(self, request, view):
        if not super(permissions.IsAuthenticated, self).has_permission(request, view):
            return False

        book_pk = request.resolver_match.kwargs['book_pk']
        user_pk = request.user.id

        try:
            book = Book.objects.get(pk=book_pk)
            return book.owner is not None and book.owner.id == user_pk
        except Book.DoesNotExist:
            return False
