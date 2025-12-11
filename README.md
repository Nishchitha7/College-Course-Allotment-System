# College Course Enrollment System

A full-stack web application for managing college courses and student enrollments with MongoDB integration.

## Features

- Create, read, update, and delete courses
- Enroll students in courses
- View all enrolled students
- Delete cancelled courses (students are automatically unenrolled)

## Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose ODM

## Prerequisites

1. [Node.js](https://nodejs.org/) (version 14 or higher)
2. [MongoDB](https://www.mongodb.com/try/download/community) (local installation or MongoDB Atlas)

## Installation

1. Clone or download this repository

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies (optional, as we're serving static files):
   ```bash
   cd client
   # No dependencies needed for static files
   ```

## Database Setup

1. Make sure MongoDB is running on your system:
   ```bash
   mongod
   ```
   
2. The application will automatically connect to MongoDB at `mongodb://localhost:27017/college-course-system`

3. To use a different MongoDB URI, update the `.env` file in the server directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd server
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

2. Serve the frontend files using any HTTP server. For example, using Python:
   ```bash
   cd client
   python -m http.server 3000
   ```
   
   Or using Node.js `http-server`:
   ```bash
   cd client
   npx http-server -p 3000
   ```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create a new course
- `GET /api/courses/:id` - Get a specific course
- `PUT /api/courses/:id` - Update a course
- `DELETE /api/courses/:id` - Delete a course

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Enroll a new student
- `GET /api/students/:id` - Get a specific student
- `PUT /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Unenroll a student

## Project Structure

```
college-course-system/
├── client/
│   ├── index.html
│   ├── styles.css
│   └── script.js
└── server/
    ├── models/
    │   ├── Course.js
    │   └── Student.js
    ├── routes/
    │   ├── courses.js
    │   └── students.js
    ├── .env
    ├── package.json
    └── server.js
```

## Data Models

### Course
- `name` (String, required) - Course name
- `code` (String, required, unique) - Course code (e.g., CS101)
- `instructor` (String, required) - Instructor name
- `credits` (Number, required) - Credit hours (1-5)

### Student
- `name` (String, required) - Student name
- `email` (String, required, unique) - Student email
- `courseId` (ObjectId, required, ref: Course) - Reference to enrolled course

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.