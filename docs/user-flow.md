# TaskFlow – User Flow

## Overview

This document describes how users interact with TaskFlow from the moment they visit the application until they log out.

The goal is to ensure a clear, intuitive, and secure user experience throughout the application.

---

# Application Flow

```text
Landing Page
      │
      ▼
Register or Login
      │
      ▼
Authentication
      │
      ▼
Dashboard
      │
      ├──────────────┐
      ▼              ▼
 My Tasks      User Profile
      │              │
      ▼              ▼
Task Details    Update Profile
      │
      ▼
Create / Edit / Delete Task
      │
      ▼
Dashboard Updates
      │
      ▼
Logout
```

---

# Guest User Flow

A guest user is not authenticated.

```text
Landing Page
      │
      ├────────► Login
      │
      └────────► Register
```

### Guest Actions

The guest user can:

- View the landing page
- Read application information
- Register
- Login

The guest user cannot access protected pages.

---

# Registration Flow

```text
Landing Page
      │
      ▼
Register
      │
      ▼
Fill Registration Form
      │
      ▼
Validate Inputs
      │
      ├────────► Validation Error
      │
      ▼
Account Created
      │
      ▼
Login
```

---

# Login Flow

```text
Landing Page
      │
      ▼
Login
      │
      ▼
Enter Email & Password
      │
      ▼
Credentials Valid?
      │
 ┌────┴────┐
 │         │
No        Yes
 │         │
 ▼         ▼
Error   Dashboard
```

---

# Dashboard Flow

After successful authentication, the user enters the dashboard.

```text
Dashboard
      │
      ├────────► Statistics
      ├────────► Recent Tasks
      ├────────► Due Today
      ├────────► Upcoming Tasks
      └────────► Sidebar Navigation
```

---

# Task Management Flow

```text
Dashboard
      │
      ▼
My Tasks
      │
      ├────────► Search
      ├────────► Filter
      ├────────► Sort
      │
      ▼
Select Task
      │
      ▼
Task Details
      │
      ├────────► Edit
      ├────────► Delete
      └────────► Mark Complete
```

---

# Create Task Flow

```text
Dashboard
      │
      ▼
Create Task
      │
      ▼
Fill Task Form
      │
      ▼
Validate Input
      │
 ┌────┴────┐
 │         │
Invalid   Valid
 │         │
 ▼         ▼
Error   Save Task
              │
              ▼
Updated Dashboard
```

---

# Edit Task Flow

```text
Task Details
      │
      ▼
Edit Task
      │
      ▼
Update Information
      │
      ▼
Save Changes
      │
      ▼
Updated Task
```

---

# Delete Task Flow

```text
Task Details
      │
      ▼
Delete Task
      │
      ▼
Confirmation Dialog
      │
 ┌────┴────┐
 │         │
Cancel   Confirm
 │         │
 ▼         ▼
Return   Delete Task
              │
              ▼
Updated Task List
```

---

# Category Management Flow

```text
Categories
      │
      ├────────► Create Category
      ├────────► Edit Category
      └────────► Delete Category
```

---

# Profile Flow

```text
Dashboard
      │
      ▼
Profile
      │
      ▼
Update Information
      │
      ▼
Save Changes
```

---

# Logout Flow

```text
Dashboard
      │
      ▼
Logout
      │
      ▼
Authentication Cleared
      │
      ▼
Landing Page
```

---

# Protected Route Flow

```text
User Opens Protected Page
            │
            ▼
Authenticated?
       ┌────┴────┐
       │         │
      No        Yes
       │         │
       ▼         ▼
Login Page   Requested Page
```

---

# Error Flow

```text
User Action
      │
      ▼
Validation
      │
 ┌────┴────┐
 │         │
Error     Success
 │         │
 ▼         ▼
Show      Continue
Message
```

---

# Dashboard Navigation

```text
Dashboard
│
├── Home
├── My Tasks
├── Categories
├── Calendar
├── Profile
├── Settings
└── Logout
```

---

# Version 1.0 User Journey

The complete journey for a new user is:

```text
Visit Landing Page
        │
        ▼
Create Account
        │
        ▼
Login
        │
        ▼
Dashboard
        │
        ▼
Create First Task
        │
        ▼
Manage Tasks
        │
        ▼
Track Progress
        │
        ▼
Logout
```

---

# Returning User Journey

```text
Landing Page
      │
      ▼
Login
      │
      ▼
Dashboard
      │
      ▼
Continue Managing Tasks
      │
      ▼
Logout
```

---

# User Experience Principles

TaskFlow is designed around the following principles:

- Simple navigation
- Minimal number of clicks
- Clear visual feedback
- Consistent layouts
- Secure authentication
- Responsive interface
- Fast task management
- Private user workspace
- Predictable navigation
- Easy onboarding

---

# Summary

The TaskFlow user flow is designed to minimise complexity while providing a complete task management experience.

Every action follows a logical sequence, ensuring users can efficiently register, authenticate, manage tasks, organise their work, and securely access only their own data.