import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { Server, Socket } from 'socket.io';
import http from 'http';
import { connectDB } from './config/database';
import { errorHandler } from './utils';
import routes from './routes';
import jwt from 'jsonwebtoken';
import { JwtPayload, verifyToken } from './utils/jwt';
import DiscussionMessage from './models/DiscussionMessage';
import mongoose from 'mongoose';
import setupAudioHandler from './socket/audioHandler';
import path from 'path';

// Note: Environment variables are already loaded in database.ts and jwt.ts

// Connect to database
connectDB();

interface SocketUser extends Socket {
  data: {
    user: JwtPayload;
  };
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
}

// Initialize express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'], // Frontend URLs
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Setup audio namespace for WebRTC
setupAudioHandler(io);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Enable CORS for all origins (or specify your deployed domain via CORS_ORIGIN env var)
dotenv.config();
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin, credentials: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use(routes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

// Serve React static build
const clientBuildPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(clientBuildPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Socket.io server is also running`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

export default app; 