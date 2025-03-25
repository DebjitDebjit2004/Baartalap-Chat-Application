# Baartalap - A Real-Time Chat Application

Baartalap is a real-time chat application built using the MERN stack (MongoDB, Express, React, Node.js) with Socket.IO for real-time communication. It supports user authentication, profile management, and real-time messaging.

---

## Table of Contents

1. [Models](#models)
2. [Controllers](#controllers)
3. [Routes](#routes)
4. [Middlewares](#middlewares)
5. [Utils](#utils)
6. [Socket.IO Workflow](#socketio-workflow)
7. [API Endpoints](#api-endpoints)

---

## Models

### User Model
- **File**: `/Backend/Src/Models/user.model.js`
- **Schema Fields**:
  - `email`: String, required, unique.
  - `fullName`: String, required.
  - `password`: String, required, minimum length 8.
  - `profilePic`: String, default empty.
  - Timestamps: `createdAt`, `updatedAt`.

### Message Model
- **File**: `/Backend/Src/Models/message.model.js`
- **Schema Fields**:
  - `senderId`: ObjectId, references User, required.
  - `receiverId`: ObjectId, references User, required.
  - `text`: String (optional).
  - `image`: String (optional).
  - Timestamps: `createdAt`, `updatedAt`.

---

## Controllers

### User Controller
- **File**: `/Backend/Src/Controllers/user.controller.js`
- **Functions**:
  - `signup`: Handles user registration.
  - `login`: Handles user login.
  - `logout`: Clears JWT token.
  - `updateProfile`: Updates user profile picture.
  - `checkAuth`: Verifies user authentication.

### Message Controller
- **File**: `/Backend/Src/Controllers/message.controller.js`
- **Functions**:
  - `getUsersForSidebar`: Fetches all users except the logged-in user.
  - `getMessages`: Fetches messages between two users.
  - `sendMessage`: Sends a message (text or image) and emits it via Socket.IO.

---

## Routes

### User Routes
- **File**: `/Backend/Src/Routes/user.routes.js`
- **Endpoints**:
  - `POST /api/users/signup`: User registration.
  - `POST /api/users/login`: User login.
  - `POST /api/users/logout`: User logout.
  - `PUT /api/users/update-profile`: Update profile picture (protected).
  - `GET /api/users/check`: Check authentication (protected).

### Message Routes
- **File**: `/Backend/Src/Routes/message.routes.js`
- **Endpoints**:
  - `GET /api/messages/users`: Fetch all users for the sidebar (protected).
  - `GET /api/messages/:id`: Fetch messages with a specific user (protected).
  - `POST /api/messages/send/:id`: Send a message to a specific user (protected).

---

## Middlewares

### Authentication Middleware
- **File**: `/Backend/Src/Middlewares/authentication.middleware.js`
- **Function**: `protectRoute`
  - Verifies JWT token from cookies.
  - Attaches the authenticated user to the request object.
  - Returns `401 Unauthorized` if the token is invalid or missing.

---

## Utils

### Cloudinary Utility
- **File**: `/Backend/Src/Utils/cloudinary.js`
- **Purpose**: Configures and handles image uploads to Cloudinary.

### Token Generator
- **File**: `/Backend/Src/Utils/generate.token.js`
- **Purpose**: Generates JWT tokens for user authentication.

### Socket.IO Utility
- **File**: `/Backend/Src/Utils/socket.js`
- **Purpose**: Manages real-time communication using Socket.IO.

---

## Socket.IO Workflow

1. **Connection**:
   - When a user logs in, their `userId` is mapped to their `socketId`.
   - The server emits the list of online users to all connected clients.

2. **Message Emission**:
   - When a message is sent, the server emits the message to the receiver's socket (if online).

3. **Disconnection**:
   - When a user disconnects, their `socketId` is removed, and the online user list is updated.

---

## API Endpoints

### User Endpoints

| Method | Endpoint                  | Description                     | Status Codes |
|--------|---------------------------|---------------------------------|--------------|
| POST   | `/api/users/signup`       | Registers a new user.           | 201, 400, 500|
| POST   | `/api/users/login`        | Logs in a user.                 | 200, 400, 500|
| POST   | `/api/users/logout`       | Logs out a user.                | 200, 500     |
| PUT    | `/api/users/update-profile` | Updates user profile picture.  | 200, 400, 500|
| GET    | `/api/users/check`        | Checks user authentication.     | 200, 500     |

### Message Endpoints

| Method | Endpoint                  | Description                     | Status Codes |
|--------|---------------------------|---------------------------------|--------------|
| GET    | `/api/messages/users`     | Fetches all users for sidebar.  | 200, 500     |
| GET    | `/api/messages/:id`       | Fetches messages with a user.   | 200, 500     |
| POST   | `/api/messages/send/:id`  | Sends a message to a user.      | 201, 500     |

---

## How to Run

1. **Backend**:
   - Navigate to `/Backend`.
   - Run `npm install` to install dependencies.
   - Start the server with `npm run dev`.

2. **Frontend**:
   - Navigate to `/Frontend`.
   - Run `npm install` to install dependencies.
   - Start the development server with `npm run dev`.

3. **Build**:
   - Run `npm run build` from the root directory to build the frontend.

---

## Environment Variables

Create a `.env` file in the `/Backend` directory with the following keys:

```
PORT=8080
MONGO_URI=<Your MongoDB URI>
JWT_SECRET=<Your JWT Secret>
CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
CLOUDINARY_API_KEY=<Your Cloudinary API Key>
CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
```

---

## License

This project is licensed under the MIT License.