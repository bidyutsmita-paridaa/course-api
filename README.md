# Full Stack Course Management Application

A full-stack web application developed using Spring Boot, React, MySQL, and JWT authentication.

## Features

- User registration and login
- Secure password hashing using BCrypt
- JWT-based authentication
- Protected course API endpoints
- Course dashboard
- Search courses by name or description
- Refresh course list
- Logout functionality
- React frontend integrated with Spring Boot backend
- CORS configuration

## Technologies Used

### Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- MySQL
- Maven
- JSON Web Tokens (JWT)

### Frontend
- React
- Vite
- JavaScript
- HTML
- CSS

## Project Structure

```text
course-api/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── src/
│   └── main/
│       ├── java/
│       └── resources/
├── pom.xml
├── mvnw
└── README.md
```

## Prerequisites

Install the following software:

- Java 17 or compatible version
- MySQL Server 8
- Node.js and npm

## Backend Setup

1. Create a MySQL database named `course_db`.
2. Configure the database connection in `application.properties`.
3. Set the `JWT_SECRET` environment variable to a strong secret of at least 32 bytes.
4. Open a terminal in the project root directory.
5. Build the application:

```powershell
.\mvnw.cmd clean package
```

6. Start the application:

```powershell
java -jar target/course-api-0.0.1-SNAPSHOT.jar
```

Backend URL: `http://localhost:8080`

## Frontend Setup

1. Open another terminal.
2. Navigate to the frontend directory:

```powershell
cd frontend
```

3. Install the dependencies:

```powershell
npm.cmd install
```

4. Start the development server:

```powershell
npm.cmd run dev
```

Frontend URL: `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in and obtain a JWT |
| GET | `/api/courses` | Retrieve courses |
| POST | `/api/courses` | Create a course |
| PUT | `/api/courses/{id}` | Update a course |
| DELETE | `/api/courses/{id}` | Delete a course |

Course endpoints require a valid JWT access token.

## Security

- Passwords are hashed using BCrypt.
- JWT authentication protects course endpoints.
- The application uses stateless session management.
- Database credentials and JWT secrets must not be committed to GitHub.
- Production credentials should be configured using environment variables.

## Deployment

The application is deployed using Render.

Frontend:https://course-dashboard-2p3x.onrender.com.

Backend: https://course-api-zbb3.onrender.com

The React frontend is integrated with the Spring Boot backend.
User registration, login, course creation, course listing,
course search, course update, and course deletion have been tested.

## Future Improvements

- Course category filters
- Payment status integration
- Live cloud deployment
- Enhanced dashboard administration

## Author

Student Full Stack Java Capstone Project
