# vtu25330-O2h Project Management Portal

A sample full-stack task management portal built with React frontend and Node.js + Express backend.

## Setup Steps

### Backend
1. cd backend
2. npm install
3. npm start

### Frontend
1. cd frontend
2. npm install
3. npm start

## Assumptions

- The backend runs on `http://localhost:5000`.
- The frontend runs on `http://localhost:3000`.
- Tasks are stored in MongoDB via Mongoose.
- No authentication is included in this version.

## MongoDB Setup

1. Install MongoDB locally or use MongoDB Atlas.
2. Create a `.env` file inside `backend/` with:
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/vtu25330_O2h
   ```
3. Start the backend with the MongoDB server running.

## API Documentation

- GET `/tasks` - Returns all tasks.
- POST `/tasks` - Creates a new task.
  - Body: `{ "title": "Build Login Page", "description": "Create a responsive login page", "status": "Pending" }`
- PUT `/tasks/:id` - Updates task status to Completed.
  - Body: `{ "status": "Completed" }`
- DELETE `/tasks/:id` - Deletes task.

## Folder Structure

- `frontend/`
  - `src/components/`
  - `src/pages/`
  - `src/services/`
- `backend/`
  - `routes/`
  - `controllers/`
  - `models/`
  - `config/`
