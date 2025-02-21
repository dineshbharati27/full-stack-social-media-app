import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import path from 'path';
import fs from 'fs';
dotenv.config();
connectDB();

const __dirname = path.resolve();

const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());

app.get('/', (req, res) => {
    res.send("api working");
})

app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/messages', messageRoutes);


const frontendPath = path.join(__dirname, '../frontend/dist');

if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  console.error("Frontend build not found. Make sure 'npm run build' runs correctly.");
}




io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
  
    // Join a chat room
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });
  
    // Handle new messages
    socket.on('send_message', (data) => {
      io.to(data.roomId).emit('receive_message', data);
    });
  
    // Handle typing indicator
    socket.on('typing', (data) => {
      socket.to(data.roomId).emit('user_typing', data);
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });


const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));