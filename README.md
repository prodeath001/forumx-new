# ForumX

A modern discussion platform with real-time features.

## Project Structure

This project contains both frontend and backend code:

- `/` - Frontend (React + Vite)
- `/backend` - Backend (Node.js + Express + TypeScript)

## Deployment

### Render Deployment

This project is configured for deployment on Render with both frontend and backend services:

1. Frontend is deployed as a static site
2. Backend is deployed as a web service

The `render.yaml` file in the root directory contains all necessary configuration.

### Environment Variables

#### Backend

- `NODE_ENV` - Environment (development/production)
- `PORT` - Port for the server to listen on (default: 10000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

#### Frontend

- `VITE_API_URL` - URL of the backend API

## Development

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
