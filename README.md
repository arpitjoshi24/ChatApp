# Real-Time Chat Application with OAuth Login

A full-stack real-time chat application built with **React**, **Node.js**, **Express**, **MongoDB**, and **Socket.io**.  
Supports user authentication, Google/Facebook/LinkedIn OAuth, file/video sharing, and real-time messaging.

---

## Features

### Authentication
- Email & password login/signup
- OAuth login via Google, Facebook, and LinkedIn
- Unique email/phone number validation
- JWT-based authentication for API routes

### Real-Time Chat
- Instant messaging between users using Socket.io
- Message persistence in MongoDB
- Send files, images, and videos
- Chat UI with message list, input, and scrollable window

### User Management
- CRUD operations for users: Add, Edit, Delete
- User profiles stored securely in MongoDB

### Frontend
- Built with React
- Context API for Auth and Socket management
- Responsive chat interface with `MessageInput` and `MessageList` components

---

## Project Structure

chat-app/
│
├── backend/
│ ├── server.js # Entry point
│ ├── config/
│ │ ├── db.js # MongoDB connection
│ │ └── passport.js # OAuth strategies
│ ├── models/
│ │ ├── User.js # User schema
│ │ └── Message.js # Chat message schema
│ ├── routes/
│ │ ├── authRoutes.js # Login/Signup/OAuth routes
│ │ ├── userRoutes.js # User CRUD
│ │ └── chatRoutes.js # Message APIs
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── userController.js
│ │ └── chatController.js
│ ├── middleware/
│ │ ├── authMiddleware.js
│ │ └── errorHandler.js
│ ├── socket/
│ │ └── chatSocket.js # Socket.io events
│ ├── utils/
│ │ ├── generateToken.js # JWT generation
│ │ └── uploadHandler.js # File uploads
│ ├── .env # Environment variables
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ └── Chat/
│ │ │ ├── ChatWindow.jsx
│ │ │ ├── MessageInput.jsx
│ │ │ └── MessageList.jsx
│ │ ├── context/
│ │ │ ├── AuthContext.jsx
│ │ │ └── SocketContext.jsx
│ │ ├── api/
│ │ │ └── chatApi.js
│ │ ├── utils/
│ │ │ └── formatTime.js
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── package.json
│ └── vite.config.js
│
└── README.md


---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB running locally or on cloud
- OAuth credentials for Google, Facebook, LinkedIn

### Backend Setup
  bash
cd backend
npm install

### Create .env file:
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/authDB
JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret

LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

CLIENT_URL=http://localhost:5173

Start the backend:

node server.js
Frontend Setup
cd frontend
npm install
npm run dev

API Endpoints
Auth

POST /api/auth/signup – Signup with email/password

POST /api/auth/login – Login with email/password

GET /api/auth/google – Google OAuth login

GET /api/auth/facebook – Facebook OAuth login

GET /api/auth/linkedin – LinkedIn OAuth login

Users

GET /api/users – List all users

POST /api/users – Create a user

PUT /api/users/:id – Update a user

DELETE /api/users/:id – Delete a user

Chat

GET /api/chat/:receiverId – Fetch messages with a user

POST /api/chat/send – Send a message or file


---

This version:  
- Has **everything in proper code blocks**.  
- File structure, env config, commands, and API docs are **copy-paste ready**.  

If you want, I can also **add a “How to run OAuth locally” section** with proper Google/Facebook/LinkedIn steps so beginners can test login immediately.  

Do you want me to add that?