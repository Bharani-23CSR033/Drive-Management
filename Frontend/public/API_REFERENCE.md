# Backend API Reference

## Base URL
```
http://localhost:5000/api
```

## Response Format (All Endpoints)
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Human readable message"
}
```

---

## AUTH APIs (`/auth`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/register` | ✗ | - | Register with name, email, password, role |
| POST | `/login` | ✗ | - | Login, returns JWT token + user object |
| POST | `/logout` | ✓ | Any | Logout (clears token on frontend) |
| POST | `/forgot-password` | ✗ | - | Send OTP to email |
| POST | `/verify-otp` | ✗ | - | Verify OTP code |
| POST | `/reset-password` | ✗ | - | Reset password with OTP |

**Request/Response Examples:**

Register:
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
Response:
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": { "id": "...", "name": "...", "role": "..." }
  },
  "message": "Registration successful"
}
```

---

## STUDENT APIs (`/student`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/profile/:id` | ✓ | Get student profile (personal/academic details) |
| PUT | `/profile/:id` | ✓ | Update personal, academic details |
| POST | `/resume/upload` | ✓ | Upload resume file (multipart/form-data), returns URL |
| GET | `/dashboard` | ✓ | Dashboard stats (applied, shortlisted, rejected, upcoming) |
| GET | `/applications` | ✓ | All student applications (with pagination) |
| GET | `/notifications` | ✓ | Student notifications |

**Pagination Query Params:** `?page=1&limit=10`

---

## DRIVE APIs (`/drives`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/` | ✗ | - | All drives with filters (location, salary, eligibility, deadline) + pagination |
| GET | `/:id` | ✗ | - | Single drive full details |
| POST | `/` | ✓ | admin/company | Create new drive |
| PUT | `/:id` | ✓ | admin/company | Edit drive |
| DELETE | `/:id` | ✓ | admin/company | Delete drive |

**Query Filters:** `?location=Mumbai&salary=500000&deadline=2024-12-31`

---

## APPLICATION APIs (`/applications`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/` | ✓ | student | Apply for a drive (duplicate check built-in) |
| GET | `/:driveId` | ✓ | admin/company | All applicants for a drive (with pagination) |
| PUT | `/:id/status` | ✓ | admin/company | Update application status (shortlisted/rejected/selected) |

**Application Status:** `applied` → `shortlisted` → `selected` or `rejected`

---

## ADMIN APIs (`/admin`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/dashboard` | ✓ | admin | Total drives, students, placement rate % |
| GET | `/students` | ✓ | admin | All students with search + college filter |
| PUT | `/students/:id/shortlist` | ✓ | admin | Toggle student shortlist status |
| POST | `/notifications/send` | ✓ | admin | Send notification to students |
| GET | `/reports` | ✓ | admin | Drives + application summary data |
| GET | `/attendance/:driveId` | ✓ | admin | View attendance for a drive |
| POST | `/attendance/:driveId` | ✓ | admin | Mark present/absent for students |

---

## COMPANY APIs (`/company`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ✗ | Company registration |
| POST | `/login` | ✗ | Company login |
| GET | `/drives` | ✓ | Drives posted by this company |
| GET | `/applicants/:driveId` | ✓ | All applicants for company's drive |
| PUT | `/applicants/:id` | ✓ | Update applicant status |

---

## FEEDBACK APIs (`/feedback`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/` | ✓ | student | Submit feedback (rating 1-5 + text) |
| GET | `/:driveId` | ✓ | admin | View all feedback for a drive |

---

## NOTIFICATION APIs (`/notifications`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/:userId` | ✓ | Get notifications for a user |
| PUT | `/:id/read` | ✓ | Mark notification as read |

---

## CALENDAR APIs (`/calendar`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/events` | ✗ | Returns all open drives with dates for calendar view |

---

## Authentication Header

All `✓` (authenticated) endpoints require:
```
Authorization: Bearer <jwt_token>
```

---

## Database Models

### User
- `name`, `email`, `password` (hashed), `role` (student/admin/company)
- `college`, `CGPA`, `skills` (array), `resumeUrl`, `profilePic`
- `shortlisted`, `otp`, `otpExpiresAt`, `otpVerified`
- Timestamps

### Drive
- `title`, `company` (ref), `salary`, `location`, `status` (draft/open/closed)
- `eligibility` { cgpa, skills[], batch }
- `deadline`, `description`, `selectionProcess[]`
- `attendance` [{ student, status, markedAt }]
- Timestamps

### Application
- `student` (ref), `drive` (ref), `status` (applied/shortlisted/rejected/selected)
- `updatedBy` (admin/company who updated), Timestamps
- **Unique index:** (student, drive) - prevents duplicate applications

### Feedback
- `student` (ref), `drive` (ref), `rating` (1-5), `text`
- Timestamps

### Notification
- `user` (ref), `title`, `message`, `type`, `read` (boolean)
- `metadata` (mixed), Timestamps

---

## Environment Variables Required

```env
MONGO_URI=mongodb://localhost:27017/drive-management
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
PORT=5000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Response Consistency

All endpoints return:
```json
{
  "success": boolean,
  "data": { /* endpoint-specific data */ },
  "message": "string"
}
```

**Errors:**
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden (insufficient role)
- `404` - Not Found
- `409` - Conflict (duplicate application)
- `500` - Server Error

---

## Middleware Stack

1. **CORS** - Allows `http://localhost:5173` (frontend)
2. **JSON Parser** - Parses request bodies
3. **Auth Middleware** - Validates JWT tokens
4. **Role Middleware** - Checks user role on protected routes
5. **Error Handler** - Centralized error response formatting

---

## Key Features Implemented

✓ JWT-based authentication with 7-day tokens
✓ OTP-based password reset via email logs
✓ Role-based access control (student, admin, company)
✓ Duplicate application prevention
✓ Pagination on all list endpoints (page, limit)
✓ Filtering (drives by location/salary/eligibility/deadline, students by search/college)
✓ Attendance tracking per drive
✓ Centralized error handling
✓ Cloudinary integration for resume uploads (with fallback)
✓ Response consistency across all endpoints
