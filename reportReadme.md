# Backend Project Report

## Project Overview
### Purpose and Objectives
The backend of this application serves as the core engine for a modern social media platform. Its primary objective is to manage data processing, user authentication, business logic, and database interactions securely and efficiently. It aims to provide seamless RESTful APIs and real-time communication capabilities to the frontend client.

### Key Features and Functionalities
*   **User Management:** Secure user registration, authentication, authorization, and profile management.
*   **Post and Content Creation:** CRUD operations for user posts, including media handling and interactions (likes, comments).
*   **Real-time Communication:** WebSocket integration for instant messaging and live notifications.
*   **AI Integration:** Services for AI-assisted content creation and automated moderation features.
*   **Administration:** Role-based access control allowing administrators to manage users and platform content.

## Technology Stack
| Technology/Library | Purpose & Justification |
| :--- | :--- |
| **Node.js** | JavaScript runtime environment. Choosing Node.js allows for a unified language (JavaScript) across both the frontend and backend, improving development velocity. |
| **Express.js** (`express`) | Fast, unopinionated, minimalist web framework for Node.js used to build robust RESTful APIs easily. |
| **MongoDB & Mongoose** (`mongoose`) | MongoDB is a NoSQL database suited for flexible and unstructured social media data. Mongoose provides a straightforward, schema-based solution to model application data. |
| **Socket.io** (`socket.io`) | Enables real-time, bidirectional, and event-based communication, essential for live chat and instant notifications. |
| **JSON Web Token** (`jsonwebtoken`) | Used for securely transmitting information between parties as a JSON object, ideal for stateless authentication mechanisms. |
| **Bcrypt.js** (`bcrypt`) | A library to help hash passwords, ensuring that sensitive user credentials are secure in the database. |
| **Google Generative AI** (`@google/generative-ai`) | Integrated to assist users in creating engaging content and to enhance platform features using modern AI. |

## Project Structure
```text
/
├── config/           # Database connection and environment configurations
├── controllers/      # Contains the main business logic and handles incoming API requests
├── middleware/       # Custom middleware functions (e.g., authentication, error handling)
├── models/           # Mongoose schemas representing the database entities (User, Post, etc.)
├── routes/           # Express route definitions mapping URLs to controllers
│   ├── adminRouter.js
│   ├── aiRouter.js
│   ├── authRouter.js
│   ├── commentRouter.js
│   ├── messageRouter.js
│   ├── notifyRouter.js
│   ├── postRouter.js
│   └── userRouter.js
├── utils/            # Helper functions and reusable utilities
├── server.js         # The main entry point to bootstrap the Express server
└── socketServer.js   # Logic and event handling for real-time Socket.io connections
```

## Setup and Installation
### Prerequisites
*   Node.js (v14 or higher)
*   MongoDB Instance (Local or Atlas)

### Step-by-step Instructions
1.  **Clone the repository and navigate to the backend directory.**
2.  **Install Dependencies:** Run `npm install` inside the root directory.
3.  **Environment Variables:** Create a `.env` file in the root based on `.env.example`.
    *   `PORT`: Server port (e.g., 5000)
    *   `MONGODB_URL`: Connection string for MongoDB
    *   `ACCESS_TOKEN_SECRET`: Secret key for JWT
    *   `REFRESH_TOKEN_SECRET`: Secret key for Refresh Token
    *   `AI_API_KEY`: API key for Google Generative AI (if applicable)
4.  **Run the Server:**
    *   Development mode: `npm run dev` (uses nodemon)
    *   Production mode: `npm start`

## Application Architecture & Code Flow
The backend follows the standard **Model-View-Controller (MVC)** architecture (excluding the View, which is handled by the React frontend).

1.  **Request Lifecycle:** An incoming HTTP request hits the `server.js`.
2.  **Routing:** Express routes (`/routes`) match the URL and method, passing the request through necessary `middleware` (like `auth` to verify JWTs).
3.  **Controllers:** The request reaches a controller function (`/controllers`), where business logic is executed.
4.  **Database Interaction:** The controller interacts with MongoDB via Mongoose `models` (`/models`) to read, create, update, or delete data.
5.  **Response:** The controller formats the successful data or an error message into a JSON response and sends it back to the client.

## Core Functionalities
*   **Authentication & Authorization:** Implementation relies on Access and Refresh JWTs. Access tokens have short lifespans, while refresh tokens allow for seamless continuous sessions securely stored in HTTP-only cookies.
*   **Real-time Capabilities:** `socketServer.js` maintains persistent WebSocket connections with active clients. When a user sends a message or triggers a notification, the server emits an event specifically targeted to the recipient's socket IDs.

## API Documentation
*(Below is a summarized list of core modular endpoints)*
*   **Auth:** `POST /api/register`, `POST /api/login`, `POST /api/logout`, `POST /api/refresh_token`
*   **Users:** `GET /api/user/:id`, `PATCH /api/user`, `PATCH /api/user/:id/follow`
*   **Posts:** `POST /api/posts`, `GET /api/posts`, `PATCH /api/post/:id`, `DELETE /api/post/:id`
*   **Comments:** `POST /api/comment`, `PATCH /api/comment/:id`, `DELETE /api/comment/:id`
*   **Messages:** `POST /api/message`, `GET /api/message/:id`
*   **Notifications:** `POST /api/notify`, `GET /api/notifies`, `DELETE /api/notify/:id`
*   **AI/Tools:** `POST /api/ai/generate`

## Database Design
The architecture utilizes normalized and denormalized NoSQL patterns based on query frequency.
*   **User Schema:** Stores credentials, profile info, and arrays of `followers` and `following` containing user ObjectIds.
*   **Post Schema:** Contains text, images, a reference to the `user` (author), and arrays for `likes` and `comments`.
*   **Comment Schema:** Belongs to a specific `post` and `user`, enabling nested responses.
*   **Message Schema:** Used for private chats, establishing `sender`, `recipient`, and textual/media content.

## Challenges & Solutions
*   **Stateful WebSockets with Scalability:** Maintaining reliable real-time socket connections with stateless REST APIs can be tricky.
    *   *Solution:* Integrated a robust Socket.io structure mapping users' persistent database IDs to their ephemeral socket IDs dynamically on connection.
*   **Deeply Nested Queries:** Fetching a user's feed with posts, their respective authors, comments, and comment authors can be resource-intensive in MongoDB.
    *   *Solution:* Optimized Mongoose `populate()` chained methods and instituted proper indexing on frequently queried fields like `user_id` and timestamps.

## Future Improvements
*   **Caching Layer:** Introduce Redis to cache common API responses (like popular posts or global feeds) to drastically reduce database read loads.
*   **Microservices Migration:** Gradually separate the real-time messaging server from the core REST API monolithic architecture to allow for independent scaling.
*   **Advanced Rate Limiting:** Implement robust rate limiting beyond simple configurations to prevent abuse, especially considering the AI generation endpoints.

## Conclusion
The backend is built with a focus on robust data handling, security, and the ability to serve near real-time interactions. By leveraging Node, Express, and MongoDB natively, alongside real-time Socket communication, it forms a scalable and structurally sound foundation for the social media frontend.
