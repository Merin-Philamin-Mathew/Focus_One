from rest_framework import serializers
from habit_management.models import Habits


class AdminHabitSerializer(serializers.ModelSerializer):
    ''' Serializer for admin habit management '''

    class Meta:
        model = Habits
        fields = '__all__'
        read_only_fields = ('created_by', 'created_at', 'updated_at')

    def validate(self, attrs):
        habit_name = attrs.get('habit_name')
        is_public = attrs.get('is_public', False)

        # Start filtering by name and active status
        existing = Habits.objects.filter(
            habit_name__iexact=habit_name,
            is_active=True
        )

        if self.instance:
            existing = existing.exclude(pk=self.instance.pk)

        if existing.exists():
            if is_public:
                if existing.filter(is_public=True).exists():
                    raise serializers.ValidationError(
                        {"habit_name": "A public habit with this name already exists."}
                    )
            else:
                if existing.filter(is_public=False).exists():
                    raise serializers.ValidationError(
                        {"habit_name": "A private habit with this name already exists."}
                    )

        return attrs


    def create(self, validated_data):
        request = self.context['request']
        validated_data['created_by'] = request.user
        return super().create(validated_data)
            
