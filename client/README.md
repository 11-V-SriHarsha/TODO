# Todo List Client

## Project Structure
```text
client/
├── public/              # Static assets
├── src/                 # Source code
│   ├── components/      # React components
│   ├── context/         # Context API for state management
│   ├── styles/          # CSS stylesheets
│   ├── utils/           # Utility functions
│   ├── App.js           # Main application component
│   ├── index.js         # Entry point
└── README.md            # This file
```

This is the frontend for the Todo List application built with React. It provides a user interface for managing tasks and interacting with the backend server.

## Features
- User authentication (Login/Signup)
- Create, read, update, and delete todos
- Filter todos by status (pending/completed)
- Responsive design with modern UI/UX
- Note: Ensure the backend server is running at the specified API URL.

## Setup Instructions
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Run the Development Server**:
   ```bash
   npm start
   ```
3. **Build for Production**:
   ```bash
   npm run build
   ```

## Environment Variables
Create a `.env` file in the root of the client folder with the following variables:

```env
REACT_APP_API_URL=http://localhost:5000
```

## Dependencies
- React
- React Router DOM
- Axios
- Zod (for validation)

## Scripts
- `npm start`: Start the development server
- `npm run build`: Build the production version
- `npm test`: Run tests