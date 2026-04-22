# Primetrade.ai - Task Management API & Dashboard

A scalable, secure REST API and React frontend built for the Primetrade.ai Backend Developer Internship assignment. This project demonstrates modular architecture, secure data handling, and a functional user interface.

🚀 **Live Frontend Demo:** [View Deployed Dashboard Here](https://primetrade-ai-assignment-phi.vercel.app)
🔌 **Live Backend API:** `https://primetrade-ai-assignment-r2vt.onrender.com/api/v1`

## Tech Stack
* **Backend:** Node.js, Express.js, PostgreSQL (Raw SQL queries for optimized performance)
* **Frontend:** React.js, Tailwind CSS, Axios
* **Deployment:** Vercel (Frontend), Render (Backend API)
* **Security:** JWT Authentication, Bcrypt Password Hashing, Role-Based Access Control (RBAC)

## Included APIs (Core Endpoints)
**Authentication Routes:**
* `POST /api/v1/auth/register` - Registers a new user with password hashing.
* `POST /api/v1/auth/login` - Authenticates a user and returns a JWT.
* `GET /api/v1/auth/verify-login` - Verifies the active JWT token.

**Task Management Routes (Protected via JWT):**
* `POST /api/v1/tasks` - Creates a new task assigned to the authenticated user.
* `GET /api/v1/tasks` - Fetches tasks (Admins see all; Users see only their own).
* `PUT /api/v1/tasks/:id` - Updates task details and status.
* `DELETE /api/v1/tasks/:id` - Removes a task from the database.

## Core Features
1. **Secure Authentication:** User registration and login APIs with strict regex password validation and JWT issuance.
2. **Role-Based Access Control (RBAC):** Admin accounts have elevated privileges to manage all system tasks, while standard users manage only their own.
3. **Database Management:** Auto-initializing PostgreSQL tables with relational foreign keys and CASCADE deletion.
4. **Centralized Error Handling:** Global Express middleware to catch and format API errors cleanly.
5. **Responsive UI:** A clean, Tailwind-styled React dashboard featuring route protection and automatic token interception.

## Local Setup Instructions

### 1. Database & Environment Configuration
Navigate to the `backend` directory and create your secure environment configuration file. 
**Security Note: Never commit your environment variables to version control. Verify your `.gitignore` is active.**

Set up a local `.env` file containing your specific PostgreSQL connection string, preferred local port, and a secure JWT secret key.

### 2. Start the Backend
Open a terminal and navigate to the backend folder. *(Note: The database tables `users` and `tasks` will initialize automatically on the first run).*

```bash
cd backend
npm install
npm start