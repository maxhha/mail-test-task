from django.urls import path
from rest_framework import routers

from recordkeeper.views import shortlink_share, books_list

router = routers.DefaultRouter()

urlpatterns = [
    path("shortlinks/<str:pk>/share", shortlink_share, name="shortlink-share"),
    path("books", books_list, name="books-list"),
]

urlpatterns += router.urls
