from django.contrib import admin

from recordkeeper.models import RecordBook, RecordBookShortLink

admin.site.register(RecordBook)
admin.site.register(RecordBookShortLink)
