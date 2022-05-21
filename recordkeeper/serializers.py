from rest_framework import serializers

from recordkeeper.models import Book, Record


class BookSerializer(serializers.ModelSerializer):
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ["id", "is_owner"]

    def get_is_owner(self, obj):
        return self.context['request'].user == obj.owner


class RecordSerializer(serializers.ModelSerializer):
    # book = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all())

    class Meta:
        model = Record
        fields = ["id", "descripton", "deadline_at",
                  "created_at", "book", "done", "image"]
