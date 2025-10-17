import dotenv from "dotenv";
dotenv.config(); // MUST be first to load env variables so that process.env is populated

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import session from "express-session";

import connectDB from "./config/db.js";
import "./config/passport.js"; // Now safe to import AFTER dotenv.config()
import chatSocket from "./socket/chatSocket.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, credentials: true },
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/uploads", express.static("uploads"));

// Socket.io setup
chatSocket(io);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));