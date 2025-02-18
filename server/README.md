# Todo List Server

This is the backend for the Todo List application built with Node.js, Express, and MongoDB. It provides RESTful APIs for managing users and todos.

## Features
- User authentication with JWT
- CRUD operations for todos
- MongoDB database integration
- Error handling and validation

## Project Structure
```text
server/
├── config/              # Configuration files (e.g., database)
├── controllers/         # Route handlers
├── middleware/          # Custom middleware (e.g., authentication)
├── models/              # MongoDB models
├── routes/              # API routes
├── app.js               # Express application setup
├── index.js             # Server entry point
└── README.md            # This file
```

## Setup Instructions
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Set Up Environment Variables**:
   Create a `.env` file in the root of the server folder with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/todoapp
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
3. **Run the Server**:
   ```bash
   npm start
   ```
   For development with hot-reloading:
   ```bash
   npm run dev
   ```

## API Endpoints
- **Auth**:
  - `POST /api/auth/signup` - User registration
  - `POST /api/auth/login` - User login
- **Todos**:
  - `GET /api/todos` - Get all todos
  - `POST /api/todos` - Create a new todo
  - `PUT /api/todos/:id` - Update a todo
  - `DELETE /api/todos/:id` - Delete a todo

## Dependencies
- Express
- Mongoose (for MongoDB)
- Bcrypt (for password hashing)
- JSON Web Token (JWT)
- Dotenv (for environment variables)

## Scripts
- `npm start`: Start the server
- `npm run dev`: Start the server with nodemon for development
- `npm audit`: Check for vulnerabilities

## Environment Variables
Create a `.env` file in the root of the server folder with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/todoapp
JWT_SECRET=your_jwt_secret
PORT=5000
```