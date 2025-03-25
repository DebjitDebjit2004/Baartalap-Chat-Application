import dotenv from 'dotenv';
dotenv.config()
import { app, server } from './Utils/socket.js';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

const PORT = process.env.PORT || 5000;

//File requirement
import connectDB from './Config/database.config.js';
import userRoutes from './Routes/user.routes.js';
import messageRoutes from './Routes/message.routes.js';

// Custom middleware

//Body parser
app.use(express.json());
//Cookie parser
app.use(cookieParser());
//Cors middleware for cross origin requests from frontend to backend server 
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//Routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

//Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));

  //Serve index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html")); //relative path
  });
}

// Server listening on port
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  //Database connection
  connectDB();
});