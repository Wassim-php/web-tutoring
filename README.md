# Web Tutoring Platform

A full-stack web application connecting students with tutors for online learning sessions. Built with React and Node.js, featuring real-time session management and secure authentication.

## Available Routes

### Authentication
```http
POST /api/auth/login          # User login
POST /api/auth/register       # New user registration
GET  /api/auth/profile       # Get current user profile
```

### Users
```http
GET    /api/users            # List all users
GET    /api/users/:id        # Get user by ID
PUT    /api/users/:id        # Update user
DELETE /api/users/:id        # Delete user
```

### Tutors
```http
GET    /api/tutors           # List all tutors
GET    /api/tutors/:id       # Get tutor profile
POST   /api/tutors          # Create tutor profile
PUT    /api/tutors/:id      # Update full profile
PATCH  /api/tutors/:id      # Partial profile update
DELETE /api/tutors/:id      # Remove tutor
```

### Students
```http
GET    /api/students         # List all students
GET    /api/students/:id     # Get student profile
POST   /api/students        # Create student profile
PUT    /api/students/:id    # Update profile
DELETE /api/students/:id    # Remove student
```

### Sessions
```http
GET  /api/sessions/tutor/:id          # Tutor's sessions
GET  /api/sessions/student/:id        # Student's sessions
POST /api/sessions                    # Create session
PUT  /api/sessions/:id/status        # Update status
GET  /api/sessions/tutor/:id/accepted # Accepted sessions
```

### Topics
```http
GET    /api/topics          # List all topics
GET    /api/topics/:id      # Get topic details
POST   /api/topics         # Create new topic
PUT    /api/topics/:id     # Update topic
DELETE /api/topics/:id     # Remove topic
GET    /api/topics/:id/tutors # Get topic's tutors
```

## Getting Started

### Prerequisites
- Node.js v16+
- MySQL
- npm/yarn

### Installation

1. **Clone Repository**
```bash
git clone https://github.com/Wassim-php/web-tutoring.git
cd web-tutoring
```

2. **Install Dependencies**
```bash
# Backend setup
cd back-end
npm install

# Frontend setup
cd ../front-end
npm install
```

3. **Environment Setup**
```bash
# In back-end directory
copy .env.example .env
# Edit .env with your database credentials
```

4. **Start Application**
```bash
# Start backend (from back-end directory)
npm run dev

# Start frontend (from front-end directory)
npm run dev
```

## Features
- User Authentication & Authorization
- Role-based Access (Student/Tutor)
- Real-time Session Management
- Profile Management
- Topic-based Tutor Search
- Session Scheduling
- Profile Picture Upload

## Tech Stack

### Frontend
- React 18
- React Router v6
- React Bootstrap
- Axios
- Context API

### Backend
- Node.js
- Express
- MySQL
- Sequelize ORM
- JWT Authentication

## Project Structure
```
web-tutoring/
├── front-end/
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/      # Route components
│   │   ├── services/   # API services
│   │   └── context/    # React contexts
└── back-end/
    ├── src/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   └── middleware/
    └── uploads/        # User uploads
```

## Contributing
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## License
MIT License

## Contact
- GitHub: [@Wassim-php](https://github.com/Wassim-php)
- Project: [web-tutoring](https://github.com/Wassim-php/web-tutoring)