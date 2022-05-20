"""
ASGI config for mailtesttask project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/asgi/
"""

import os

from channels.routing import URLRouter, ProtocolTypeRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from django.urls import re_path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mailtesttask.settings')
asgi_app = get_asgi_application()

from recordkeeper import sse_urls  # noqa

sse_app = AuthMiddlewareStack(URLRouter(sse_urls.urlpatterns))

application = ProtocolTypeRouter({
    'http': URLRouter([
        re_path(r'api/', sse_app),
        re_path(r'', asgi_app),
    ]),
})
