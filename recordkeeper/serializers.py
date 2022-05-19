from rest_framework import serializers

from recordkeeper.models import RecordBook


class RecordBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecordBook
        fields = ["id"]
