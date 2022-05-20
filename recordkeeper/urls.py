from django.urls import path, re_path
from rest_framework_nested import routers

from recordkeeper.views import shortlink_share, media_access, BookViewSet, RecordViewSet

router = routers.SimpleRouter()
router.register(r'books', BookViewSet, basename='books')

view_router = routers.NestedSimpleRouter(router, r'books', lookup='book')
view_router.register(r'records', RecordViewSet, basename='book-records')

urlpatterns = [
    path('shortlinks/<str:pk>/share', shortlink_share, name='shortlink-share'),
    re_path(r'^uploaded/(?P<path>[0-9a-zA-Z-_\.]+)$',
            media_access, name='media'),
]

urlpatterns += router.urls
urlpatterns += view_router.urls
