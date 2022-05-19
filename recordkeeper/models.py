import uuid
from django.db import models
from django.contrib.auth import get_user_model
from shortuuid.django_fields import ShortUUIDField

User = get_user_model()


class RecordBook(models.Model):
    """Model for record books"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    users = models.ManyToManyField(User)


class RecordBookShortLink(models.Model):
    """Model for references to record books made by short ids"""
    id = ShortUUIDField(length=7, primary_key=True, editable=False)
    book = models.ForeignKey(
        'RecordBook', on_delete=models.CASCADE, null=False)
