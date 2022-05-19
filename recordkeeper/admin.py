from django.contrib import admin

from recordkeeper.models import Book, ShortLink, Record

admin.site.register(Book)
admin.site.register(ShortLink)
admin.site.register(Record)
