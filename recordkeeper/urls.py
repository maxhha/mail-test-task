from django.urls import path, re_path
from rest_framework_nested import routers

from recordkeeper.views import shortlink_share, book_share, media_access, BookViewSet, RecordViewSet

router = routers.SimpleRouter()
router.register(r'books', BookViewSet, basename='books')

record_router = routers.NestedSimpleRouter(router, r'books', lookup='book')
record_router.register(r'records', RecordViewSet, basename='book-records')

urlpatterns = [
    path('shortlinks/<str:pk>/share', shortlink_share, name='shortlink-share'),
    re_path(r'^books/(?P<book_pk>[0-9]+)/share',
            book_share, name='book-share'),
    re_path(r'^uploaded/(?P<path>[0-9a-zA-Z-_\.]+)$',
            media_access, name='media'),
]

urlpatterns += router.urls
urlpatterns += record_router.urls
