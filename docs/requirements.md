# TaskFlow – Requirements Specification

## 1. Introduction

This document defines the functional and non-functional requirements for **TaskFlow**, a full-stack personal task management application.

TaskFlow allows users to create secure accounts, manage private tasks, organise work using categories and priorities, track progress, and monitor deadlines through a modern dashboard.

The first release focuses on delivering a stable, secure, responsive, and complete Version 1.0 that satisfies the Codveda Technologies Level 3 internship requirements.

---

# 2. Project Scope

TaskFlow Version 1.0 will include:

- Secure user registration and login
- JWT-based authentication
- Private user accounts
- Complete task CRUD functionality
- Categories
- Priorities
- Due dates
- Task progress
- Search
- Filtering
- Sorting
- Dashboard statistics
- User profile management
- Responsive user interface
- Landing page
- API integration between React and Django
- PostgreSQL data storage

The application is designed for individual task management.

Team collaboration, real-time updates, recurring tasks, and advanced notifications are outside the Version 1.0 scope.

---

# 3. User Types

## 3.1 Guest User

A guest user is not authenticated.

A guest user can:

- View the landing page
- View public information about TaskFlow
- Open the registration page
- Create a new account
- Open the login page
- Log in with valid credentials

A guest user cannot:

- Access the dashboard
- View tasks
- Create tasks
- Edit tasks
- Delete tasks
- Access another user’s information

---

## 3.2 Authenticated User

An authenticated user has successfully logged in.

An authenticated user can:

- Access their dashboard
- View their own task statistics
- Create tasks
- View their own tasks
- Update their own tasks
- Delete their own tasks
- Mark tasks as completed
- Reopen completed tasks
- Search tasks
- Filter tasks
- Sort tasks
- Create categories
- Update categories
- Delete categories
- View and update their profile
- Log out

An authenticated user cannot:

- View another user’s tasks
- Edit another user’s tasks
- Delete another user’s tasks
- Access another user’s categories
- Modify another user’s profile

---

## 3.3 Administrator

The administrator uses the Django Admin interface.

The administrator can:

- View registered users
- Activate or deactivate users
- View tasks
- View categories
- Manage application data
- Monitor application records

A separate React administrator dashboard is not required for Version 1.0.

---

# 4. Functional Requirements

## 4.1 Landing Page Requirements

The system shall provide a public landing page.

The landing page shall include:

- Navigation bar
- Hero section
- Clear description of TaskFlow
- Primary call-to-action button
- Login link
- Registration link
- Feature overview
- Application preview
- How-it-works section
- Final call-to-action section
- Footer

The landing page shall be accessible without authentication.

---

# 5. Authentication Requirements

## 5.1 User Registration

The system shall allow a guest user to create an account.

The registration form shall include:

- First name
- Last name
- Email address
- Password
- Confirm password

The system shall:

- Require all mandatory fields
- Validate the email format
- Require a unique email address
- Validate password strength
- Confirm that both password fields match
- Hash passwords before storing them
- Return validation messages for invalid input
- Prevent duplicate account registration

After successful registration, the system shall either:

- Redirect the user to the login page, or
- Authenticate the user automatically

The final behaviour will be defined during implementation.

---

## 5.2 User Login

The system shall allow a registered user to log in using:

- Email address
- Password

The system shall:

- Validate submitted credentials
- Reject invalid credentials
- Return a clear error message
- Generate authentication tokens after successful login
- Redirect the user to the dashboard
- Prevent authenticated users from accessing the login page unnecessarily

---

## 5.3 JWT Authentication

The system shall use JWT authentication.

The authentication flow shall support:

- Access tokens
- Refresh tokens
- Token refresh
- Authenticated API requests
- Protected backend endpoints
- Protected frontend routes

The frontend shall include the access token in authenticated API requests.

The backend shall verify the token before returning protected data.

---

## 5.4 Logout

The system shall allow an authenticated user to log out.

On logout, the system shall:

- Clear stored authentication data
- Remove the current user session from the frontend
- Redirect the user to the login or landing page
- Prevent access to protected pages after logout

Refresh-token invalidation may be added if the final token strategy supports it.

---

## 5.5 Current User

The system shall provide an endpoint for retrieving the authenticated user’s information.

The response shall include:

- User ID
- First name
- Last name
- Email address
- Date joined
- Profile information

---

# 6. Profile Management Requirements

## 6.1 View Profile

An authenticated user shall be able to view their profile.

The profile shall display:

- First name
- Last name
- Email address
- Profile image, if available
- Account creation date
- Theme preference, if supported

---

## 6.2 Update Profile

An authenticated user shall be able to update:

- First name
- Last name
- Profile image
- Bio, if included
- Theme preference, if included

Email changes may require additional verification and may be postponed.

---

## 6.3 Profile Ownership

A user shall only access and update their own profile.

The backend shall determine profile ownership from the authenticated user rather than accepting another user’s ID without validation.

---

# 7. Task Management Requirements

## 7.1 Create Task

An authenticated user shall be able to create a task.

A task shall include:

- Title
- Description
- Status
- Priority
- Category
- Start date
- Due date
- Progress percentage

Required fields:

- Title

Optional fields:

- Description
- Category
- Start date
- Due date

Default values:

- Status: `TODO`
- Priority: `MEDIUM`
- Progress: `0`

The system shall automatically assign the task to the authenticated user.

The frontend shall not allow the user to manually assign ownership.

---

## 7.2 View Tasks

An authenticated user shall be able to view a list of their own tasks.

The task list shall display key information, including:

- Title
- Status
- Priority
- Category
- Due date
- Progress

The backend shall only return tasks belonging to the authenticated user.

---

## 7.3 View Task Details

An authenticated user shall be able to open a task details page.

The page shall display:

- Title
- Description
- Status
- Priority
- Category
- Start date
- Due date
- Progress
- Completion date
- Creation date
- Last updated date

The user shall not be able to view another user’s task by changing the task ID in the URL.

---

## 7.4 Update Task

An authenticated user shall be able to update their own task.

Editable fields shall include:

- Title
- Description
- Status
- Priority
- Category
- Start date
- Due date
- Progress

The system shall validate the updated data before saving it.

---

## 7.5 Delete Task

An authenticated user shall be able to delete their own task.

The frontend shall display a confirmation dialog before deletion.

After successful deletion:

- The task shall be removed from the database
- The task list shall update
- The user shall receive a success notification

---

## 7.6 Complete Task

An authenticated user shall be able to mark a task as completed.

When a task becomes completed:

- Status shall become `COMPLETED`
- Progress shall become `100`
- Completion date shall be recorded

---

## 7.7 Reopen Task

An authenticated user shall be able to reopen a completed task.

When reopened:

- Status shall change from `COMPLETED`
- Completion date shall be cleared
- Progress may remain editable below `100`

---

# 8. Task Status Requirements

The supported Version 1.0 status values shall be:

```text
TODO
IN_PROGRESS
COMPLETED
```

An optional future value may be:

```text
CANCELLED
```

Status labels shall be displayed in a user-friendly format:

```text
To Do
In Progress
Completed
```

---

# 9. Task Priority Requirements

The supported priority values shall be:

```text
LOW
MEDIUM
HIGH
URGENT
```

Each priority shall have a distinct visual badge.

Priority shall influence filtering and sorting but shall not automatically restrict any task action.

---

# 10. Category Requirements

## 10.1 Create Category

An authenticated user shall be able to create a category.

A category shall include:

- Name
- Colour

The category shall belong to the authenticated user.

---

## 10.2 View Categories

An authenticated user shall be able to view their own categories.

The system shall not return categories belonging to another user.

---

## 10.3 Update Category

An authenticated user shall be able to update:

- Category name
- Category colour

---

## 10.4 Delete Category

An authenticated user shall be able to delete their own category.

When a category is deleted, tasks assigned to that category shall remain available.

Their category value shall become empty rather than deleting the tasks.

---

## 10.5 Category Uniqueness

A user shall not be able to create two categories with the same name.

Different users may use the same category name.

Example:

```text
Reem → University
Ahmed → University
```

This is valid because the categories belong to different users.

---

# 11. Search Requirements

The system shall allow users to search their tasks.

Search shall support:

- Task title
- Task description

Search shall be case-insensitive.

Search results shall only include tasks belonging to the authenticated user.

The task list shall display an empty state when no results are found.

---

# 12. Filter Requirements

The system shall allow users to filter tasks by:

- Status
- Priority
- Category
- Due date

Due-date filters may include:

- Due today
- Overdue
- Upcoming
- No due date

Users shall be able to combine filters.

Example:

```text
Status: In Progress
Priority: High
Category: University
```

---

# 13. Sorting Requirements

The system shall allow users to sort tasks by:

- Creation date
- Updated date
- Due date
- Priority
- Title

Sorting shall support ascending and descending order where appropriate.

Default sorting shall be:

```text
Newest tasks first
```

---

# 14. Pagination Requirements

The backend shall support pagination for task lists.

The frontend shall display pagination controls or an equivalent loading pattern.

The default page size may be:

```text
10 tasks per page
```

The final page size may be adjusted during implementation.

---

# 15. Dashboard Requirements

The authenticated dashboard shall include:

- User greeting
- Total task count
- Completed task count
- Pending task count
- In-progress task count
- Overdue task count
- Completion percentage
- Tasks due today
- Upcoming tasks
- Recent tasks

The dashboard shall use the authenticated user’s data only.

---

## 15.1 Completion Rate

The system shall calculate the completion rate using:

```text
Completed Tasks ÷ Total Tasks × 100
```

When the user has no tasks, the completion rate shall be `0`.

---

## 15.2 Overdue Tasks

A task shall be considered overdue when:

- The due date has passed
- The task status is not `COMPLETED`

---

## 15.3 Tasks Due Today

The dashboard shall identify tasks whose due date matches the current date and whose status is not completed.

---

# 16. Calendar Requirements

A basic calendar view may be included in Version 1.0 if time permits.

The calendar shall:

- Display tasks according to due date
- Allow the user to select a date
- Display tasks due on the selected date

Advanced calendar integrations are excluded from Version 1.0.

---

# 17. User Interface Requirements

The interface shall include:

- Responsive navigation
- Dashboard sidebar
- Mobile navigation
- Reusable buttons
- Reusable form inputs
- Task cards or task rows
- Priority badges
- Status badges
- Confirmation dialogs
- Loading indicators
- Empty states
- Error messages
- Success notifications

The visual design shall use:

- Clean white or light-grey surfaces
- Dark readable text
- Energetic yellow accents
- Rounded cards
- Consistent spacing
- Subtle shadows
- Smooth transitions

---

# 18. Responsive Design Requirements

The application shall support:

- Desktop screens
- Laptop screens
- Tablet screens
- Mobile screens

The layout shall adapt without horizontal scrolling under normal usage.

On smaller screens:

- The sidebar shall collapse or become a mobile menu
- Task cards shall stack vertically
- Forms shall remain usable
- Buttons shall remain accessible
- Text shall remain readable

---

# 19. Form Validation Requirements

## 19.1 Registration Validation

The system shall validate:

- Required fields
- Valid email format
- Unique email
- Password strength
- Matching passwords

---

## 19.2 Login Validation

The system shall validate:

- Required email
- Required password
- Valid credentials

---

## 19.3 Task Validation

The system shall validate:

- Required title
- Title length
- Description length
- Valid status
- Valid priority
- Progress range
- Valid dates
- Category ownership

---

## 19.4 Category Validation

The system shall validate:

- Required category name
- Name length
- Unique name per user
- Valid colour value

---

# 20. Business Rules

## 20.1 Task Ownership

Every task shall belong to exactly one user.

Task ownership shall be assigned by the backend using the authenticated user.

---

## 20.2 Category Ownership

Every category shall belong to exactly one user.

A task may only use a category owned by the same user.

---

## 20.3 Due-Date Rule

When both start date and due date are provided:

```text
Due date must not be earlier than start date
```

---

## 20.4 Progress Rule

Progress shall be an integer between:

```text
0 and 100
```

---

## 20.5 Completion Rule

When status becomes `COMPLETED`:

```text
Progress = 100
Completion date = current date and time
```

When a completed task is reopened:

```text
Completion date = empty
```

---

## 20.6 User Isolation

All protected database queries shall be limited to the authenticated user.

The system shall not depend only on frontend hiding.

Ownership validation must occur on the backend.

---

# 21. Error Handling Requirements

The application shall provide clear feedback for:

- Invalid login
- Duplicate email
- Expired token
- Unauthorised access
- Missing required fields
- Invalid dates
- Task not found
- Category not found
- Server error
- Network error

The frontend shall avoid displaying raw backend errors directly to users.

---

# 22. Loading and Empty-State Requirements

The frontend shall show loading feedback while:

- Authenticating the user
- Loading tasks
- Creating a task
- Updating a task
- Deleting a task
- Loading dashboard statistics

Empty states shall be displayed when:

- The user has no tasks
- No search results exist
- No categories exist
- No tasks are due today
- No upcoming deadlines exist

---

# 23. Notification Requirements

The frontend shall display toast notifications for successful or failed actions.

Examples:

- Account created successfully
- Login successful
- Task created
- Task updated
- Task deleted
- Category created
- Profile updated
- Request failed

Persistent notification records are not required for Version 1.0.

---

# 24. Security Requirements

The system shall:

- Hash passwords using Django authentication
- Never store plain-text passwords
- Require authentication for protected endpoints
- Validate ownership on the backend
- Restrict CORS to approved origins in production
- Store secrets in environment variables
- Exclude `.env` files from Git
- Avoid exposing sensitive data in API responses
- Validate all user input
- Use HTTPS in production
- Prevent users from selecting arbitrary ownership IDs

---

# 25. Non-Functional Requirements

## 25.1 Performance

The application should:

- Load public pages quickly
- Return standard API responses within a reasonable time
- Use pagination for large task lists
- Avoid unnecessary API requests
- Avoid unnecessary React re-renders
- Optimise images used on the landing page

---

## 25.2 Reliability

The application shall:

- Preserve saved tasks correctly
- Handle invalid input safely
- Avoid data loss during normal operations
- Return predictable API responses
- Display useful error states when the server is unavailable

---

## 25.3 Usability

The application shall:

- Use clear navigation
- Use readable labels
- Provide visible action feedback
- Use consistent buttons and form styles
- Make important actions easy to find
- Require confirmation for destructive actions

---

## 25.4 Accessibility

The application should:

- Use semantic HTML
- Provide form labels
- Support keyboard navigation
- Maintain readable colour contrast
- Include visible focus states
- Use descriptive button text
- Provide alternative text for meaningful images
- Avoid relying only on colour to communicate status

---

## 25.5 Maintainability

The codebase shall:

- Use separate frontend and backend directories
- Use reusable React components
- Separate API services from page components
- Organise Django logic into applications
- Use environment variables
- Include meaningful naming
- Include focused Git commits
- Include technical documentation

---

## 25.6 Scalability

The Version 1.0 architecture should allow future support for:

- More users
- More tasks
- Additional task features
- Notifications
- Collaboration
- Recurring tasks
- File attachments

Scalability in this context means clean extensibility, not enterprise-scale infrastructure.

---

## 25.7 Compatibility

The application should support recent versions of:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari

The project shall be tested primarily in Chrome and Edge.

---

# 26. API Requirements

The backend shall expose RESTful JSON endpoints.

The API shall:

- Use standard HTTP methods
- Return appropriate status codes
- Require authentication where necessary
- Validate request data
- Return consistent error responses
- Support search
- Support filtering
- Support ordering
- Support pagination

Expected methods:

```text
GET
POST
PATCH
DELETE
```

`PUT` may be supported but is not required for standard frontend usage.

---

# 27. Database Requirements

The production database shall use PostgreSQL.

The database shall support:

- Users
- Profiles
- Categories
- Tasks
- Relationships
- Ownership constraints
- Timestamps
- Validation constraints

SQLite may be used temporarily during initial local setup, but PostgreSQL is the target database.

---

# 28. Deployment Requirements

The completed application shall include:

- Deployed React frontend
- Deployed Django backend
- Deployed PostgreSQL database
- Production environment variables
- Configured CORS
- Working authentication
- Working CRUD operations
- Public GitHub repository
- Live demo links

Suggested platforms:

- Frontend: Vercel
- Backend: Render
- Database: Render PostgreSQL or another PostgreSQL provider

---

# 29. Documentation Requirements

The repository shall include:

- Main README
- Project plan
- Requirements specification
- Database design
- API design
- User flow
- Development roadmap
- Setup instructions
- Screenshots
- Technology stack
- Feature list
- Deployment links
- Internship task mapping

---

# 30. Testing Requirements

The backend should include tests for:

- Registration
- Login
- Protected endpoint access
- Task creation
- Task retrieval
- Task update
- Task deletion
- User task isolation
- Category ownership
- Validation rules

The frontend shall be manually tested for:

- Authentication flow
- Protected routing
- Forms
- Task CRUD
- Search
- Filters
- Responsive layouts
- Loading states
- Error states

Automated frontend tests are optional for Version 1.0.

---

# 31. Version 1.0 Acceptance Criteria

TaskFlow Version 1.0 will be considered complete when:

- A user can register
- A user can log in
- A user can log out
- Protected routes work
- A user can create a task
- A user can view their tasks
- A user can update a task
- A user can delete a task
- A user can complete and reopen a task
- A user can create and manage categories
- Search works
- Filters work
- Sorting works
- Dashboard statistics work
- Users cannot access each other’s data
- Validation errors are handled
- The interface is responsive
- The landing page is complete
- The frontend and backend are deployed
- PostgreSQL is connected
- The README and documentation are complete

---

# 32. Features Excluded from Version 1.0

The following features are postponed:

- Team workspaces
- Shared tasks
- Comments
- Real-time collaboration
- Chat
- Email reminders
- Push notifications
- Recurring tasks
- File attachments
- Social login
- Email verification
- Password reset by email
- Mobile application
- Advanced analytics
- Third-party calendar integration
- Drag-and-drop Kanban board

These features may be added in future versions after the required application is stable.

---

# 33. Requirement Priorities

## Must Have

- Registration
- Login
- Logout
- JWT authentication
- Protected routes
- User isolation
- Task CRUD
- Categories
- Priorities
- Due dates
- Search
- Filters
- Responsive design
- REST API
- PostgreSQL
- Deployment

## Should Have

- Dashboard statistics
- Sorting
- Pagination
- Progress tracking
- Profile management
- Toast notifications
- Empty states
- Confirmation dialogs

## Could Have

- Calendar view
- Theme switching
- Profile image
- Animated dashboard elements
- Advanced visual statistics

## Will Not Have in Version 1.0

- Collaboration
- Recurring tasks
- File attachments
- Real-time updates
- Email reminders
- Mobile application

---

# 34. Project Status

Current phase:

**Phase 0 — Planning and System Design**

Requirements status:

**Completed for initial Version 1.0 planning**

The requirements may be refined during development when technical constraints or usability improvements are identified.