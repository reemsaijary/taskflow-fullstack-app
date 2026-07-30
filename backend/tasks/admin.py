from django.contrib import admin

from .models import Category, Task


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "user",
        "colour",
        "created_at",
    ]

    search_fields = [
        "name",
        "user__email",
    ]

    list_filter = [
        "created_at",
    ]


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "user",
        "category",
        "status",
        "priority",
        "progress",
        "due_date",
        "created_at",
    ]

    search_fields = [
        "title",
        "description",
        "user__email",
    ]

    list_filter = [
        "status",
        "priority",
        "category",
        "due_date",
        "created_at",
    ]

    readonly_fields = [
        "completed_at",
        "created_at",
        "updated_at",
    ]