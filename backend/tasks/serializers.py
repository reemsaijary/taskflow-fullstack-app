from rest_framework import serializers

from .models import Category, Task


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "colour",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]


class TaskSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    class Meta:
        model = Task
        fields = [
            "id",
            "category",
            "category_name",
            "title",
            "description",
            "status",
            "priority",
            "start_date",
            "due_date",
            "progress",
            "completed_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "category_name",
            "completed_at",
            "created_at",
            "updated_at",
        ]

    def validate_category(self, category):
        request = self.context.get("request")

        if category and category.user != request.user:
            raise serializers.ValidationError(
                "You cannot use another user's category."
            )

        return category

    def validate(self, attrs):
        start_date = attrs.get(
            "start_date",
            getattr(self.instance, "start_date", None),
        )

        due_date = attrs.get(
            "due_date",
            getattr(self.instance, "due_date", None),
        )

        if start_date and due_date and due_date < start_date:
            raise serializers.ValidationError(
                {
                    "due_date": (
                        "The due date cannot be earlier than "
                        "the start date."
                    )
                }
            )

        return attrs