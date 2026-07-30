from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import (
    MaxValueValidator,
    MinValueValidator,
    RegexValidator,
)
from django.db import models
from django.utils import timezone


hex_colour_validator = RegexValidator(
    regex=r"^#[0-9A-Fa-f]{6}$",
    message="Enter a valid hexadecimal colour such as #FACC15.",
)


class Category(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="categories",
    )

    name = models.CharField(max_length=100)

    colour = models.CharField(
        max_length=7,
        default="#FACC15",
        validators=[hex_colour_validator],
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

        constraints = [
            models.UniqueConstraint(
                fields=["user", "name"],
                name="unique_category_name_per_user",
            ),
        ]

        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        self.name = self.name.strip()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Task(models.Model):
    class Status(models.TextChoices):
        TODO = "TODO", "To Do"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        COMPLETED = "COMPLETED", "Completed"

    class Priority(models.TextChoices):
        LOW = "LOW", "Low"
        MEDIUM = "MEDIUM", "Medium"
        HIGH = "HIGH", "High"
        URGENT = "URGENT", "Urgent"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tasks",
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        related_name="tasks",
        blank=True,
        null=True,
    )

    title = models.CharField(max_length=200)

    description = models.TextField(
        blank=True,
        max_length=2000,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.TODO,
    )

    priority = models.CharField(
        max_length=10,
        choices=Priority.choices,
        default=Priority.MEDIUM,
    )

    start_date = models.DateField(
        blank=True,
        null=True,
    )

    due_date = models.DateField(
        blank=True,
        null=True,
    )

    progress = models.PositiveSmallIntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100),
        ],
    )

    completed_at = models.DateTimeField(
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["user", "priority"]),
            models.Index(fields=["user", "due_date"]),
        ]

    def clean(self):
        errors = {}

        if self.start_date and self.due_date:
            if self.due_date < self.start_date:
                errors["due_date"] = (
                    "The due date cannot be earlier than the start date."
                )

        if self.category and self.category.user_id != self.user_id:
            errors["category"] = (
                "The selected category must belong to the task owner."
            )

        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        self.title = self.title.strip()

        if self.status == self.Status.COMPLETED:
            self.progress = 100

            if self.completed_at is None:
                self.completed_at = timezone.now()
        else:
            self.completed_at = None

            if self.progress == 100:
                self.progress = 99

        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title