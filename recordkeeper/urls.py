from django.urls import path
from rest_framework import routers

from recordkeeper.views import shortlink_share

router = routers.DefaultRouter()

urlpatterns = [
    path("shortlinks/<str:pk>/share", shortlink_share, name="shortlink-share"),
]

urlpatterns += router.urls
