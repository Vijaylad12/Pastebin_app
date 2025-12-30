# Pastebin Lite

A simple, secure, and modern pastebin application built with React, Node.js, and MongoDB.

## 🚀 Live Demo

Check out the live app here: **[https://pastebin-app-three.vercel.app](https://pastebin-app-three.vercel.app)**

Feel free to create and share pastes! The app is fully functional and ready to use.

## Features
- Create text pastes with optional expiration (TTL)
- Limit maximum views for pastes
- Secure, random ID generation
- Clean, responsive UI
- MongoDB Atlas for persistent storage

## Tech Stack
- **Frontend**: React, Vite, Axios
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB Atlas

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas Account (or local MongoDB)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the example:
   ```env
   PORT=3001
   MONGODB_URI=your_mongodb_connection_string
   FRONTEND_URL=http://localhost:5173
   BASE_URL=http://localhost:3001
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:3001
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### `POST /api/pastes`
Create a new paste.
- Body: `{ "content": "string", "ttl_seconds": number (optional), "max_views": number (optional) }`

### `GET /api/pastes/:id`
Retrieve a paste (JSON). Increments view count.

### `GET /p/:id`
View paste in browser (HTML). Does not increment view count.

### `GET /api/healthz`
Check API and Database health.
