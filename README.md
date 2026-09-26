# CineTrack

A small full-stack movie tracker built with Express, MongoDB Atlas, and plain HTML/CSS/JavaScript.

## Features
- View all movies from MongoDB
- Add a new movie
- Update watched status and rating
- Delete a movie
- Tonight's Queue saved in localStorage
- Responsive movie card layout

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Deployment:
  - Frontend: Vercel
  - Backend: Render

## Project Structure
```text
cinetrack/
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── images/
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── seed.js
│   ├── package.json
│   └── .env
├── .gitignore
├── README.md
└── package.json
```

## Local Setup

### 1. Install dependencies
```bash
cd /home/jesse/Desktop/cinetrack/backend
npm install
```

### 2. Create a `.env` file
```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/cinetrack?retryWrites=true&w=majority
```

### 3. Start the backend
```bash
cd /home/jesse/Desktop/cinetrack/backend
npm start
```

### 4. Start the frontend
```bash
cd /home/jesse/Desktop/cinetrack/frontend
python3 -m http.server 5500
```

Then open:
```text
http://127.0.0.1:5500
```

## API Endpoints

### GET /api/health
Returns server status.

### GET /api/movies
Returns all movies.

### GET /api/movies/:id
Returns one movie by MongoDB `_id`.

### POST /api/movies
Creates a movie.

### PUT /api/movies/:id
Updates watched status or rating.

### DELETE /api/movies/:id
Deletes a movie.

## Local Storage
The Tonight's Queue uses browser `localStorage` and stores only movie IDs. It is not a database replacement.

## Deployment
- Frontend: deploy the `frontend` folder on Vercel
- Backend: deploy the `backend` folder on Render
- Database: MongoDB Atlas

## Important
- Never commit `.env`
- Never expose database credentials
- Use environment variables on Render and Vercel
