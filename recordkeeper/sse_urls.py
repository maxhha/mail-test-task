from django.urls import re_path
from recordkeeper.consumers import BookEventsConsumer

urlpatterns = [
    re_path(
        r'^books/(?P<pk>[0-9]+)/sse$',
        BookEventsConsumer.as_asgi(),
    ),
]
