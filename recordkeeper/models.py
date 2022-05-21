from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from shortuuid.django_fields import ShortUUIDField

User = get_user_model()


class Book(models.Model):
    """Model for record books"""
    id = models.AutoField(primary_key=True, editable=False)
    users = models.ManyToManyField(User)


class ShortLink(models.Model):
    """Model for references to record books made by short ids"""
    id = ShortUUIDField(length=7, primary_key=True, editable=False)
    book = models.ForeignKey(
        'Book', on_delete=models.CASCADE, null=False)

    def get_absolute_url(self):
        return f'{settings.PUBLIC_URL}/share/{self.id}'


class Record(models.Model):
    """Model for records"""
    id = models.AutoField(primary_key=True, editable=False)
    descripton = models.TextField(null=False)
    deadline_at = models.DateTimeField(null=False)
    created_at = models.DateTimeField(
        auto_now_add=True, editable=False, null=False)
    book = models.ForeignKey(
        'Book', on_delete=models.CASCADE, null=False, editable=False)
    done = models.BooleanField(default=False, null=False)
    image = models.ImageField(default=None, null=True)
