# Task Tracker App

A full-stack task management application built with Next.js, Express, and MongoDB. This application allows users to create, manage, and track their daily tasks with authentication and authorization.

## 🚀 Features

- **User Authentication**: Secure signup and login with JWT-based authentication
- **Task Management**: Create, read, update, and delete tasks
- **Task Filtering**: Filter tasks by status (All, Pending, Completed)
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Security**: Protected routes with JWT tokens, helmet, rate limiting, and CORS
- **Real-time Updates**: Instant task updates and status changes

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **React Icons** - Icon library
- **date-fns** - Date utility library

### Backend
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-Origin Resource Sharing
- **Express Rate Limit** - Rate limiting middleware

## 📁 Project Structure

```
Todo_Assn/
├── backend/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── taskController.js  # Task CRUD operations
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── errorHandler.js    # Global error handling
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Task.js            # Task schema
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   └── tasks.js           # Task routes
│   ├── index.js               # Server entry point
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── (auth)/
    │   │   ├── login/         # Login page
    │   │   └── signup/        # Signup page
    │   ├── dashboard/         # Main dashboard
    │   ├── layout.jsx         # Root layout
    │   ├── page.jsx           # Home page
    │   └── globals.css        # Global styles
    ├── components/
    │   ├── FilterBar.jsx      # Task filter component
    │   ├── Navbar.jsx         # Navigation bar
    │   ├── TaskForm.jsx       # Task creation form
    │   ├── TaskItem.jsx       # Individual task item
    │   └── TaskList.jsx       # Task list container
    ├── lib/
    │   ├── api.js             # API client setup
    │   └── auth.js            # Auth utilities
    └── package.json
```

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Todo_Assn
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following environment variables to `backend/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/tasktracker
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/tasktracker

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env.local file
touch .env.local
```

Add the following environment variables to `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🚀 Running the Application

### Start Backend Server

```bash
# From backend directory
npm run dev
# Server will run on http://localhost:5000
```

Or for production:

```bash
npm start
```

### Start Frontend Development Server

```bash
# From frontend directory
npm run dev
# Frontend will run on http://localhost:3000
```

For production build:

```bash
npm run build
npm start
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Tasks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Get all user tasks | Yes |
| GET | `/api/tasks/:id` | Get single task | Yes |
| POST | `/api/tasks` | Create new task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |

## 🔐 Authentication Flow

1. User signs up with email and password
2. Password is hashed using bcryptjs
3. Upon login, JWT token is generated
4. Token is stored in localStorage
5. Token is sent with each protected API request via Authorization header
6. Backend middleware verifies token for protected routes

## 📱 Application Features

### User Management
- Secure user registration with password hashing
- Login with email and password
- Persistent authentication using JWT tokens
- Automatic logout on token expiration

### Task Management
- Create tasks with title and description
- Mark tasks as completed/pending
- Edit existing tasks
- Delete tasks
- Filter tasks by status (All, Pending, Completed)

### UI/UX
- Clean and modern interface
- Responsive design for mobile and desktop
- Loading states and error handling
- Toast notifications for user actions
- Smooth animations and transitions

## 🔒 Security Features

- **Password Hashing**: Passwords are hashed using bcryptjs before storage
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Middleware to verify authentication
- **Helmet**: Security headers for Express app
- **Rate Limiting**: Prevents brute force attacks
- **CORS**: Configured for specific origin
- **Input Validation**: Server-side validation using express-validator

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or check Atlas connection string
- Verify MONGO_URI in backend .env file
- Check network access settings for MongoDB Atlas

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### CORS Errors
- Verify FRONTEND_URL in backend .env matches your frontend URL
- Check that API calls use the correct NEXT_PUBLIC_API_URL

## 🚀 Deployment

### Backend Deployment (e.g., Heroku, Railway)
1. Set environment variables on hosting platform
2. Update FRONTEND_URL to production frontend URL
3. Deploy backend code

### Frontend Deployment (e.g., Vercel, Netlify)
1. Set NEXT_PUBLIC_API_URL to production backend URL
2. Build and deploy frontend

## 📝 Environment Variables Summary

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the database solution
- All contributors and users of this project

## 📧 Contact

For any questions or support, please open an issue in the repository.

---

**Happy Task Tracking! ✅**
