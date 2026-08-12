
# ScamShield Backend

Backend API for the ScamShield hackathon project.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT
- bcrypt

## Features

- User Signup
- User Login
- JWT Authentication
- Protected User Profile
- Logout
- Input Validation
- PostgreSQL Database Integration

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/signup` | Create a new user account | No |
| POST | `/api/auth/login` | Login and receive JWT | No |
| GET | `/api/auth/me` | Get authenticated user | Yes |
| POST | `/api/auth/logout` | Logout authenticated user | Yes |

## Project Structure

```text
server/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── config/
│   │   └── prisma.js
│   ├── controllers/
│   │   └── auth.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── routes/
│   │   └── auth.routes.js
│   ├── services/
│   │   └── auth.service.js
│   ├── utils/
│   │   ├── jwt.js
│   │   └── password.js
│   ├── validators/
│   │   └── auth.validator.js
│   ├── app.js
│   └── server.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── prisma.config.ts
Setup
1. Clone the repository
git clone https://github.com/abhishek-mishra16/ScamSheild-backend.git
cd ScamSheild-backend
2. Install dependencies
npm install
3. Configure environment variables

Create a .env file in the server root:

DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/scamshield"
JWT_SECRET="your_jwt_secret_here"
JWT_EXPIRES_IN="7d"
PORT=5000
FRONTEND_URL="http://localhost:3000"
4. Run database migrations
npx prisma migrate dev
5. Generate Prisma Client
npx prisma generate
6. Start the development server
npm run dev

Backend will run on:

http://localhost:5000
Health Check
GET /api/health

Expected response:

{
  "success": true,
  "message": "ScamShield backend is running"
}
Authentication

Protected endpoints require a JWT:

Authorization: Bearer <token>
Security
Passwords are hashed using bcrypt.
Authentication uses JWT.
Environment secrets are stored in .env.
.env is excluded from Git using .gitignore.
.env.example contains only placeholder values.
Development
npm run dev
License

This project was developed for a hackathon.




