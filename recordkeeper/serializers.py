from rest_framework import serializers

from recordkeeper.models import Book, Record


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["id"]


class RecordSerializer(serializers.ModelSerializer):
    book = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all())

    class Meta:
        model = Record
        fields = ["id", "descripton", "deadline_at",
                  "created_at", "book", "done", "image"]
