from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import Profile, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ["-date_joined"]

    list_display = [
        "email",
        "first_name",
        "last_name",
        "is_active",
        "is_staff",
        "date_joined",
    ]

    search_fields = [
        "email",
        "first_name",
        "last_name",
    ]

    list_filter = [
        "is_active",
        "is_staff",
        "is_superuser",
    ]

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "email",
                    "password",
                )
            },
        ),
        (
            "Personal information",
            {
                "fields": (
                    "first_name",
                    "last_name",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (
            "Important dates",
            {
                "fields": (
                    "last_login",
                    "date_joined",
                )
            },
        ),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "first_name",
                    "last_name",
                    "password1",
                    "password2",
                    "is_active",
                    "is_staff",
                ),
            },
        ),
    )

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "theme_preference",
        "created_at",
        "updated_at",
    ]

    search_fields = [
        "user__email",
        "user__first_name",
        "user__last_name",
    ]

    list_filter = [
        "theme_preference",
        "created_at",
    ]