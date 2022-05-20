from corsheaders.conf import conf
from corsheaders.middleware import ACCESS_CONTROL_ALLOW_CREDENTIALS, ACCESS_CONTROL_ALLOW_ORIGIN, ACCESS_CONTROL_ALLOW_HEADERS, ACCESS_CONTROL_ALLOW_METHODS


class CorsMiddleware:
    def __init__(self, app):
        # Store the ASGI application we were passed
        self.app = app

    async def __call__(self, scope, receive, send):
        origin = next(
            (value for header,
             value in scope['headers'] if header == b'origin'),
            None,
        )

        cors_headers = [
            [ACCESS_CONTROL_ALLOW_CREDENTIALS.encode("utf-8"), b'true'],
        ]
        if self.origin_found_in_white_lists(origin):
            cors_headers += [
                [ACCESS_CONTROL_ALLOW_ORIGIN.encode("utf-8"), origin],
            ]

        if scope['method'] == 'OPTIONS':
            cors_headers += [
                [ACCESS_CONTROL_ALLOW_HEADERS.encode("utf-8"),
                 ', '.join(conf.CORS_ALLOW_HEADERS).encode("utf-8")],
                [ACCESS_CONTROL_ALLOW_METHODS.encode("utf-8"),
                 ', '.join(conf.CORS_ALLOW_METHODS).encode("utf-8")],
            ]
            await send({
                'type': 'http.response.start',
                'status': 200,
                'headers': cors_headers,
                'more_body': True,
            })
            await send({
                'type': 'http.response.body',
                'body': b'',
                'more_body': False,
            })
            return

        scope['cors_headers'] = cors_headers

        return await self.app(scope, receive, send)

    def origin_found_in_white_lists(self, origin: str) -> bool:
        return any(
            origin == allowed.encode("utf-8")
            for allowed in conf.CORS_ALLOWED_ORIGINS
        )
