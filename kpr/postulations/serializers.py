from rest_framework import serializers
from authentication.serializers import AccountSerializer
from postulations.models import Postulation

class PostSerializer(serializers.ModelSerializer):
    author = AccountSerializer(read_only=True, required=False)

    class Meta:
        model = Postulation

        fields = ('id', 'author', 'repository', 'name_postulation', 'description_postulation', 'status', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(PostSerializer, self).get_validation_exclusions()

        return exclusions + ['author']