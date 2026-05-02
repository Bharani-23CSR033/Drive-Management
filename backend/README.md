# Drive Management Backend

Backend server for the Drive Management System built with Node.js, Express, and MongoDB.

## Overview

The backend provides RESTful APIs for managing:
- User authentication (Students, Companies, Admins)
- Drive postings and management
- Job applications
- Notifications
- Feedback and reviews
- Admin reporting and analytics

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Port:** 5000

## Project Structure

```
backend/
├── config/                 # Configuration files
│   ├── db.js              # MongoDB connection
│   └── cloudinary.js      # File upload service
├── controllers/           # Business logic
│   ├── admin.controller.js
│   ├── application.controller.js
│   ├── auth.controller.js
│   ├── company.controller.js
│   ├── drive.controller.js
│   ├── feedback.controller.js
│   ├── notification.controller.js
│   └── student.controller.js
├── middleware/            # Express middleware
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── role.middleware.js
├── models/                # Data schemas
│   ├── Application.js
│   ├── Drive.js
│   ├── Feedback.js
│   ├── Notification.js
│   └── User.js
├── routes/                # API routes
│   ├── admin.routes.js
│   ├── application.routes.js
│   ├── auth.routes.js
│   ├── calendar.routes.js
│   ├── company.routes.js
│   ├── drive.routes.js
│   ├── feedback.routes.js
│   ├── notification.routes.js
│   └── student.routes.js
├── utils/                 # Utility functions
│   ├── generateToken.js
│   ├── otpGenerator.js
│   └── sendEmail.js
├── app.js                 # Express app setup
├── server.js              # Server entry point
├── package.json
└── .env                   # Environment variables
```

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables** (.env):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/driveDB
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. **Start MongoDB:**
```bash
# Make sure MongoDB is running on localhost:27017
mongod
```

4. **Run the server:**
```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

The server will be running at `http://localhost:5000`

## API Routes

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (protected)
- `POST /logout` - Logout user (protected)
- `POST /password-reset` - Reset password

### Drives (`/api/drives`)
- `GET /` - Get all drives
- `GET /:id` - Get drive by ID
- `GET /:id/applicants` - Get drive applicants (protected)
- `POST /` - Create drive (protected)
- `PUT /:id` - Update drive (protected)
- `DELETE /:id` - Delete drive (protected)

### Applications (`/api/applications`)
- `GET /` - Get applications (protected)
- `POST /` - Apply to drive (protected)
- `PUT /:id/status` - Update application status (protected)

### Student (`/api/student`)
- `GET /profile/:id` - Get student profile (protected)
- `PUT /profile/:id` - Update student profile (protected)
- `POST /resume/upload` - Upload resume (protected)
- `GET /dashboard` - Get student dashboard (protected)
- `GET /applications` - Get student applications (protected)
- `GET /notifications` - Get student notifications (protected)

### Admin (`/api/admin`)
- `GET /dashboard` - Get admin dashboard (protected)
- `GET /students` - Get all students (protected)
- `GET /reports` - Get reports (protected)
- `GET /attendance/:driveId` - Get attendance (protected)
- `POST /attendance/:driveId` - Mark attendance (protected)

### Company (`/api/company`)
- `POST /auth/register` - Register company
- `POST /auth/login` - Login company
- `GET /drives` - Get company drives (protected)
- `GET /applicants` - Get applicants (protected)

### Calendar (`/api/calendar`)
- `GET /events` - Get calendar events

### Feedback (`/api/feedback`)
- `POST /` - Submit feedback (protected)
- `GET /` - Get feedback

## Authentication

The backend uses JWT (JSON Web Tokens) for authentication. Protected routes require an `Authorization` header:

```
Authorization: Bearer <token>
```

### Roles
- **student** - Student/candidate role
- **company** - Recruiting company role
- **admin** - Administrator role

## Data Models

### User
- Email, name, password
- CGPA, skills, branch
- Role-based access

### Drive
- Title, description, salary
- Eligibility criteria
- Deadline, location
- Status (open, closed, draft)

### Application
- Drive ID, student ID
- Application status
- Resume attachment

### Notification
- User ID, message
- Type and read status
- Timestamp

### Feedback
- Drive ID, student ID
- Rating, comments
- Submission date

## Features

✅ JWT-based authentication  
✅ Role-based access control  
✅ Drive posting and management  
✅ Job application system  
✅ Attendance tracking  
✅ Analytics and reporting  
✅ Notification system  
✅ File uploads (Cloudinary)  
✅ Email notifications  
✅ Password reset functionality  

## Error Handling

All errors are handled by the global error middleware and return appropriate HTTP status codes:
- 200 - Success
- 201 - Created
- 400 - Bad Request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not Found
- 500 - Server Error

## Development

### Environment Variables Required
```
PORT
MONGODB_URI
JWT_SECRET
CLOUDINARY_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

### Scripts
```bash
npm run dev     # Start development server with nodemon
npm start       # Start production server
npm test        # Run tests (if configured)
```

## Database Connection

MongoDB should be running at `mongodb://localhost:27017/driveDB`

Collections:
- users
- drives
- applications
- notifications
- feedback

## Status

✅ **All routes operational**  
✅ **All controllers functional**  
✅ **Database connected and configured**  
✅ **Authentication and authorization working**  
✅ **Error handling implemented**  

## Deployment

The backend is ready for deployment on:
- Heroku
- Railway
- Render
- AWS
- Any Node.js hosting platform

Ensure environment variables are set properly on your hosting platform.

## Support

For issues or questions, refer to the main project README.md

