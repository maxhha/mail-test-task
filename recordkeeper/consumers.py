import json
from channels.db import database_sync_to_async
from channels.exceptions import StopConsumer
from channels.generic.http import AsyncHttpConsumer

from rest_framework import status
from recordkeeper.permissions import is_user_has_permission_over_book


class BookEventsConsumer(AsyncHttpConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.book_pk = None
        self.book_group_name = None

    async def http_request(self, message):
        if self.scope['method'] != 'GET':
            await self.send_response(status=status.HTTP_404_NOT_FOUND)
            raise StopConsumer()

        if "body" in message:
            self.body.append(message["body"])

        if message.get("more_body"):
            return

        self.book_pk = self.scope['url_route']['kwargs']['pk']
        user_pk = self.scope['user'].id

        has_permission = await database_sync_to_async(
            is_user_has_permission_over_book,
        )(self.book_pk, user_pk)

        if not has_permission:
            await self.send_response(status=status.HTTP_403_FORBIDDEN)
            raise StopConsumer()

        await self.send_headers(headers=[
            *self.scope["cors_headers"],
            (b'Cache-Control', b'no-cache'),
            (b'Content-Type', b'text/event-stream'),
            (b'Transfer-Encoding', b'chunked'),
        ])
        self.book_group_name = f'book_{self.book_pk}'

        await self.channel_layer.group_add(
            self.book_group_name,
            self.channel_name
        )

    async def send_response(self, status, body=b'', **kwargs):
        await self.send_headers(status=status, **kwargs)
        await self.send_body(body)

    async def record_created(self, event):
        payload = f'event: record_created\ndata: {json.dumps(event["data"])}\n\n'
        await self.send_body(payload.encode('utf-8'), more_body=True)

    async def record_updated(self, event):
        if event['sessiodid'] == self.scope['sessionid']:
            return
        payload = f'event: record_updated\ndata: {json.dumps(event["data"])}\n\n'
        await self.send_body(payload.encode('utf-8'), more_body=True)

    async def disconnect(self):
        await self.channel_layer.group_discard(
            self.book_group_name,
            self.channel_name
        )
