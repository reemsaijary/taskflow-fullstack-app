# TaskFlow – Database Design

## 1. Overview

This document defines the database structure for **TaskFlow**, a full-stack personal task management application.

The database will store:

- User accounts
- User profiles
- Task categories
- Tasks
- Ownership relationships
- Task status and progress
- Creation and update timestamps

The main goal of the database design is to ensure that every user can securely access and manage only their own data.

---

# 2. Database Technology

The production database will use:

```text
PostgreSQL
```

During early local development, SQLite may be used temporarily.

The final deployed application should use PostgreSQL.

---

# 3. Main Database Entities

TaskFlow Version 1.0 will use four main entities:

```text
User
Profile
Category
Task
```

Their responsibilities are:

| Entity | Purpose |
|---|---|
| User | Stores authentication and account information |
| Profile | Stores additional user information |
| Category | Organises a user’s tasks |
| Task | Stores the user’s tasks and task-related data |

---

# 4. Entity Relationship Overview

```text
User
 │
 ├── has one ─────────────► Profile
 │
 ├── has many ────────────► Categories
 │
 └── has many ────────────► Tasks

Category
 │
 └── has many ────────────► Tasks

Task
 │
 ├── belongs to ──────────► User
 │
 └── may belong to ───────► Category
```

---

# 5. Entity Relationship Diagram

```text
┌─────────────────────┐
│        User         │
├─────────────────────┤
│ id                  │
│ email               │
│ first_name          │
│ last_name           │
│ password            │
│ is_active           │
│ is_staff            │
│ date_joined         │
└──────────┬──────────┘
           │
           │ One-to-One
           ▼
┌─────────────────────┐
│       Profile       │
├─────────────────────┤
│ id                  │
│ user_id             │
│ bio                 │
│ profile_image       │
│ theme_preference    │
│ created_at          │
│ updated_at          │
└─────────────────────┘


┌─────────────────────┐
│        User         │
└──────────┬──────────┘
           │
           │ One-to-Many
           ▼
┌─────────────────────┐
│      Category       │
├─────────────────────┤
│ id                  │
│ user_id             │
│ name                │
│ colour              │
│ created_at          │
│ updated_at          │
└──────────┬──────────┘
           │
           │ One-to-Many
           ▼
┌─────────────────────┐
│        Task         │
├─────────────────────┤
│ id                  │
│ user_id             │
│ category_id         │
│ title               │
│ description         │
│ status              │
│ priority            │
│ start_date          │
│ due_date            │
│ progress            │
│ completed_at        │
│ created_at          │
│ updated_at          │
└─────────────────────┘
```

---

# 6. User Model

## 6.1 Purpose

The `User` model stores authentication and account information.

TaskFlow will use a custom Django user model where the email address is the main login identifier.

Users will log in using:

```text
Email + Password
```

A separate username will not be required.

---

## 6.2 User Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | BigAutoField | Yes | Primary key |
| email | EmailField | Yes | Unique login email |
| first_name | CharField | Yes | User’s first name |
| last_name | CharField | Yes | User’s last name |
| password | CharField | Yes | Hashed password |
| is_active | BooleanField | Yes | Controls account access |
| is_staff | BooleanField | Yes | Allows Django Admin access |
| is_superuser | BooleanField | Yes | Grants full administrative permissions |
| date_joined | DateTimeField | Yes | Account creation date |
| last_login | DateTimeField | No | Most recent login date |

---

## 6.3 User Constraints

The `User` model shall follow these rules:

- Email must be unique.
- Email must use a valid format.
- Email shall be stored in lowercase.
- Passwords shall never be stored as plain text.
- Every user must have an active status.
- Only authorised staff users may access Django Admin.
- A deleted user’s related private data should also be deleted.

---

## 6.4 Suggested Django Model Structure

```python
class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]
```

A custom user manager will also be required to create normal users and superusers.

---

# 7. Profile Model

## 7.1 Purpose

The `Profile` model stores optional information that does not belong directly in the authentication model.

Each user shall have one profile.

---

## 7.2 Profile Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | BigAutoField | Yes | Primary key |
| user | OneToOneField | Yes | Related user |
| bio | TextField | No | Short user biography |
| profile_image | ImageField | No | User profile image |
| theme_preference | CharField | Yes | Preferred interface theme |
| created_at | DateTimeField | Yes | Profile creation date |
| updated_at | DateTimeField | Yes | Last profile update |

---

## 7.3 Theme Choices

Suggested theme values:

```text
LIGHT
DARK
SYSTEM
```

Default:

```text
SYSTEM
```

Theme preference may remain optional during initial implementation.

---

## 7.4 Profile Relationship

```text
User 1 ───────── 1 Profile
```

This is a one-to-one relationship.

Each user has one profile, and each profile belongs to one user.

---

## 7.5 Profile Deletion Rule

When a user is deleted:

```text
The related profile shall also be deleted.
```

Recommended Django behaviour:

```python
on_delete=models.CASCADE
```

---

## 7.6 Suggested Django Model Structure

```python
class Profile(models.Model):
    class ThemePreference(models.TextChoices):
        LIGHT = "LIGHT", "Light"
        DARK = "DARK", "Dark"
        SYSTEM = "SYSTEM", "System"

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
    )

    bio = models.TextField(blank=True)

    profile_image = models.ImageField(
        upload_to="profiles/",
        blank=True,
        null=True,
    )

    theme_preference = models.CharField(
        max_length=10,
        choices=ThemePreference.choices,
        default=ThemePreference.SYSTEM,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

---

# 8. Category Model

## 8.1 Purpose

The `Category` model allows users to organise tasks.

Example categories:

```text
Work
University
Personal
Learning
Urgent
```

Each category belongs to one user.

Different users may create categories with the same name.

---

## 8.2 Category Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | BigAutoField | Yes | Primary key |
| user | ForeignKey | Yes | Category owner |
| name | CharField | Yes | Category name |
| colour | CharField | Yes | Category display colour |
| created_at | DateTimeField | Yes | Creation date |
| updated_at | DateTimeField | Yes | Last update date |

---

## 8.3 Category Relationship

```text
User 1 ───────── Many Categories
```

One user may create many categories.

Each category belongs to exactly one user.

---

## 8.4 Category Name Rules

A category name shall:

- Be required
- Contain meaningful text
- Have a maximum length
- Be unique for the same user
- Be case-insensitively checked where practical

Example:

```text
User A → Work
User B → Work
```

This is valid.

However:

```text
User A → Work
User A → Work
```

This should not be allowed.

---

## 8.5 Category Colour

The colour may be stored as a hexadecimal colour value.

Example:

```text
#FACC15
```

A validation rule should confirm the expected format.

Suggested default:

```text
#FACC15
```

---

## 8.6 Category Deletion Rule

When a category is deleted:

- The related tasks shall not be deleted.
- The task’s category value shall become empty.

Recommended Django behaviour:

```python
on_delete=models.SET_NULL
```

---

## 8.7 Category Uniqueness Constraint

The combination below must be unique:

```text
user + name
```

Suggested Django constraint:

```python
models.UniqueConstraint(
    fields=["user", "name"],
    name="unique_category_name_per_user",
)
```

---

## 8.8 Suggested Django Model Structure

```python
class Category(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="categories",
    )

    name = models.CharField(max_length=100)

    colour = models.CharField(
        max_length=7,
        default="#FACC15",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

        constraints = [
            models.UniqueConstraint(
                fields=["user", "name"],
                name="unique_category_name_per_user",
            )
        ]
```

---

# 9. Task Model

## 9.1 Purpose

The `Task` model is the main entity in TaskFlow.

It stores each task created by a user.

Every task must belong to exactly one user.

A task may optionally belong to one category.

---

## 9.2 Task Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| id | BigAutoField | Yes | Primary key |
| user | ForeignKey | Yes | Task owner |
| category | ForeignKey | No | Optional task category |
| title | CharField | Yes | Task title |
| description | TextField | No | Detailed task description |
| status | CharField | Yes | Current task status |
| priority | CharField | Yes | Task priority |
| start_date | DateField | No | Planned starting date |
| due_date | DateField | No | Task deadline |
| progress | PositiveSmallIntegerField | Yes | Completion percentage |
| completed_at | DateTimeField | No | Completion timestamp |
| created_at | DateTimeField | Yes | Task creation date |
| updated_at | DateTimeField | Yes | Most recent update |

---

# 10. Task Status Choices

The supported status values are:

```text
TODO
IN_PROGRESS
COMPLETED
```

Suggested Django choices:

```python
class Status(models.TextChoices):
    TODO = "TODO", "To Do"
    IN_PROGRESS = "IN_PROGRESS", "In Progress"
    COMPLETED = "COMPLETED", "Completed"
```

Default status:

```text
TODO
```

---

# 11. Task Priority Choices

The supported priority values are:

```text
LOW
MEDIUM
HIGH
URGENT
```

Suggested Django choices:

```python
class Priority(models.TextChoices):
    LOW = "LOW", "Low"
    MEDIUM = "MEDIUM", "Medium"
    HIGH = "HIGH", "High"
    URGENT = "URGENT", "Urgent"
```

Default priority:

```text
MEDIUM
```

---

# 12. Task Relationships

## 12.1 User and Task

```text
User 1 ───────── Many Tasks
```

A user may create many tasks.

Each task belongs to exactly one user.

---

## 12.2 Category and Task

```text
Category 1 ───────── Many Tasks
```

A category may contain many tasks.

A task may belong to:

- One category
- No category

---

# 13. Task Ownership Rules

Task ownership is one of the most important security rules.

The backend shall:

- Assign the authenticated user automatically when creating a task.
- Never trust a user ID submitted by the frontend.
- Return only tasks owned by the authenticated user.
- Prevent users from accessing another user’s task.
- Prevent users from updating another user’s task.
- Prevent users from deleting another user’s task.

Correct backend logic:

```python
Task.objects.filter(user=request.user)
```

Incorrect logic:

```python
Task.objects.all()
```

for a standard authenticated user endpoint.

---

# 14. Task Validation Rules

## 14.1 Title Validation

The title shall:

- Be required
- Not contain only whitespace
- Have a maximum length of 200 characters

---

## 14.2 Description Validation

The description shall:

- Be optional
- Support longer text
- Have a reasonable maximum length if API validation is added

---

## 14.3 Progress Validation

Progress must be between:

```text
0 and 100
```

Valid examples:

```text
0
25
50
75
100
```

Invalid examples:

```text
-1
101
150
```

---

## 14.4 Date Validation

When both dates exist:

```text
due_date >= start_date
```

The following is invalid:

```text
Start date: 10 August 2026
Due date: 8 August 2026
```

---

## 14.5 Category Ownership Validation

A task may only use a category that belongs to the same user.

Example:

```text
Task owner: User A
Category owner: User A
```

This is valid.

The following must be rejected:

```text
Task owner: User A
Category owner: User B
```

---

## 14.6 Completion Validation

When status becomes:

```text
COMPLETED
```

The system should automatically set:

```text
progress = 100
completed_at = current date and time
```

When a completed task is reopened:

```text
completed_at = null
```

Progress should become less than `100` if the task is no longer completed.

---

# 15. Suggested Task Model Structure

```python
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
        User,
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

    description = models.TextField(blank=True)

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

    progress = models.PositiveSmallIntegerField(default=0)

    completed_at = models.DateTimeField(
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
```

The final model will also include validation logic.

---

# 16. Database Relationships Summary

| Parent | Child | Relationship | Deletion Behaviour |
|---|---|---|---|
| User | Profile | One-to-One | Delete profile |
| User | Category | One-to-Many | Delete categories |
| User | Task | One-to-Many | Delete tasks |
| Category | Task | One-to-Many | Keep task and set category to null |

---

# 17. Deletion Behaviour

## 17.1 User Deletion

When a user is deleted:

- Their profile shall be deleted.
- Their categories shall be deleted.
- Their tasks shall be deleted.

This uses:

```python
on_delete=models.CASCADE
```

---

## 17.2 Category Deletion

When a category is deleted:

- The related tasks shall remain.
- Their category field shall become `null`.

This uses:

```python
on_delete=models.SET_NULL
```

---

## 17.3 Task Deletion

When a task is deleted:

- Only the task record is deleted.
- The user and category remain unchanged.

---

# 18. Database Indexes

Indexes may be added to improve common queries.

Recommended indexed fields include:

- User email
- Task user
- Task status
- Task priority
- Task due date
- Task creation date
- Category user

Django automatically indexes:

- Primary keys
- Foreign keys
- Unique fields

Additional indexes may be added later if required.

Example:

```python
class Meta:
    indexes = [
        models.Index(fields=["user", "status"]),
        models.Index(fields=["user", "due_date"]),
        models.Index(fields=["user", "priority"]),
    ]
```

---

# 19. Data Integrity Rules

The database and backend shall enforce:

- Unique user email
- One profile per user
- Unique category name per user
- Valid category ownership
- Valid task ownership
- Valid status values
- Valid priority values
- Progress between 0 and 100
- Due date not earlier than start date
- Completed tasks with 100% progress
- Completed timestamp for completed tasks

Some rules will be enforced through database constraints, while others will be enforced through Django model and serializer validation.

---

# 20. Automatic Timestamps

The following entities shall include timestamps:

```text
Profile
Category
Task
```

Each shall include:

```text
created_at
updated_at
```

Recommended Django configuration:

```python
created_at = models.DateTimeField(auto_now_add=True)
updated_at = models.DateTimeField(auto_now=True)
```

---

# 21. Example Database Records

## 21.1 Example User

```text
id: 1
email: reem@example.com
first_name: Reem
last_name: Saijary
is_active: true
date_joined: 2026-08-01 10:00
```

---

## 21.2 Example Profile

```text
id: 1
user_id: 1
bio: Computer Science graduate learning backend development
theme_preference: SYSTEM
```

---

## 21.3 Example Category

```text
id: 1
user_id: 1
name: Learning
colour: #FACC15
```

---

## 21.4 Example Task

```text
id: 1
user_id: 1
category_id: 1
title: Build TaskFlow authentication
description: Implement registration, login and protected routes
status: IN_PROGRESS
priority: HIGH
start_date: 2026-08-01
due_date: 2026-08-05
progress: 50
completed_at: null
created_at: 2026-08-01 11:00
updated_at: 2026-08-02 13:30
```

---

# 22. Query Examples

## Get the authenticated user’s tasks

```python
Task.objects.filter(user=request.user)
```

---

## Get incomplete tasks

```python
Task.objects.filter(
    user=request.user,
).exclude(
    status=Task.Status.COMPLETED,
)
```

---

## Get completed tasks

```python
Task.objects.filter(
    user=request.user,
    status=Task.Status.COMPLETED,
)
```

---

## Get overdue tasks

```python
Task.objects.filter(
    user=request.user,
    due_date__lt=timezone.localdate(),
).exclude(
    status=Task.Status.COMPLETED,
)
```

---

## Get tasks due today

```python
Task.objects.filter(
    user=request.user,
    due_date=timezone.localdate(),
).exclude(
    status=Task.Status.COMPLETED,
)
```

---

## Get tasks by category

```python
Task.objects.filter(
    user=request.user,
    category=category,
)
```

---

# 23. Future Database Entities

The following entities are not required for Version 1.0 but may be added later:

```text
Subtask
Notification
Reminder
Attachment
Comment
Workspace
Team
TaskAssignment
RecurringTask
ActivityLog
```

These models should not be added until the core Version 1.0 application is stable.

---

# 24. Version 1.0 Database Scope

Version 1.0 includes:

- Custom User
- Profile
- Category
- Task
- Secure ownership relationships
- Task status
- Task priority
- Progress tracking
- Due dates
- Automatic timestamps

Version 1.0 excludes:

- Shared tasks
- Team workspaces
- Comments
- Attachments
- Recurring tasks
- Persistent notifications
- Collaboration history

---

# 25. Final Database Structure

```text
User
├── Profile
├── Categories
│   └── Tasks
└── Tasks
```

The final relationship structure is:

```text
User 1 ─────── 1 Profile

User 1 ─────── Many Categories

User 1 ─────── Many Tasks

Category 1 ─── Many Tasks

Task Many ──── 1 User

Task Many ──── 0 or 1 Category
```

---

# 26. Database Design Status

Current phase:

**Phase 0 — Planning and System Design**

Database design status:

**Completed for initial Version 1.0 planning**

The design may be refined during Django implementation, but major structural changes should be documented before they are applied.