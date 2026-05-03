# Team Task Manager

A full-stack project management web app where users can sign up, create projects, invite team members, assign tasks, and track progress with role-based access control.

## Submission

- Live App: [mellow-education-production-f09a.up.railway.app](https://mellow-education-production-f09a.up.railway.app)
- GitHub Repository: [github.com/yudhveer10/team-task-manager](https://github.com/yudhveer10/team-task-manager)
- Demo Video: https://drive.google.com/file/d/1pc_8CCEs9vfnMQ6dyO91je7q8iplitCo/view?usp=drivesdk

## Overview

This project was built for a full-stack assignment that required:

- Authentication with signup and login
- Project and team management
- Task assignment and status tracking
- Role-based access control for Admin and Member users
- Dashboard for tasks, progress, and overdue work
- Deployment using Railway

The application uses a React frontend and an Express backend, with PostgreSQL and Prisma for relational data management.

## Features

- Public user signup and login
- JWT-based authentication
- Create and manage projects
- Add members to projects by email
- Admin and Member role handling
- Create, assign, update, and delete tasks
- Track task status with `TODO`, `IN_PROGRESS`, and `DONE`
- Dashboard summary for projects, tasks, and overdue items
- Responsive UI with animated auth experience and polished workspace layout

## Roles

### Admin

- Create projects
- Invite members to a project
- Promote or demote members
- Remove members
- Create and delete tasks
- Update task workflow

### Member

- Access projects they belong to
- Create tasks inside their project
- Update task status
- View members, tasks, and project activity

## Tech Stack

- Frontend: React, Vite, React Router
- Backend: Node.js, Express
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JWT, bcryptjs
- Deployment: Railway

## Project Structure

```text
team-task-manager/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── styles.css
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── utils/
│   └── package.json
└── README.md
```

## Database Design

The backend uses PostgreSQL with Prisma because this assignment depends on strong data relationships.

Main entities:

- `User`
- `Project`
- `ProjectMember`
- `Task`

Relationships:

- One user can own many projects
- One project can have many members
- One user can belong to many projects through `ProjectMember`
- One project can have many tasks
- One task can be assigned to one user

## API Summary

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Dashboard

- `GET /api/dashboard`

### Projects

- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:projectId`
- `POST /api/projects/:projectId/members`
- `PATCH /api/projects/:projectId/members/:memberId`
- `DELETE /api/projects/:projectId/members/:memberId`

### Tasks

- `GET /api/projects/:projectId/tasks`
- `POST /api/projects/:projectId/tasks`
- `PATCH /api/projects/:projectId/tasks/:taskId`
- `DELETE /api/projects/:projectId/tasks/:taskId`

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/yudhveer10/team-task-manager.git
cd team-task-manager
```

### 2. Setup backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:3000
JWT_SECRET=replace-with-a-strong-secret
DATABASE_URL="postgresql://postgres:password@localhost:5432/team_task_manager?schema=public"
```

Run Prisma:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Start backend:

```bash
npm run dev
```

### 3. Setup frontend

```bash
cd ../client
npm install
```

Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

## Deployment

The app is deployed on Railway using separate services:

- Backend service from `server`
- Frontend service from `client`
- PostgreSQL service from Railway

### Backend Railway notes

- Root directory: `server`
- Build command: `npm install && npx prisma generate`
- Start command: `npx prisma migrate deploy && npm start`
- Healthcheck path: `/health`

### Frontend Railway notes

- Root directory: `client`
- Build command: `npm install && npm run build`
- Start command: `npm run preview -- --host 0.0.0.0 --port 8010`

### Environment Variables

Backend:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your_secret_here
CLIENT_URL=https://mellow-education-production-f09a.up.railway.app
```

Frontend:

```env
VITE_API_BASE_URL=YOUR_BACKEND_RAILWAY_URL/api
```

## UI Notes

The frontend was designed to feel more product-ready than a plain assignment submission:

- Warm gradient background and glassmorphism cards
- Improved typography using `Manrope`
- Responsive layout for auth, dashboard, and project pages
- Subtle animations including fade, float, and pulse effects

## What I Would Improve Next

- Kanban drag-and-drop task board
- Team avatars and profile settings
- Activity timeline and notifications
- Search and filters for tasks
- Better analytics on dashboard
- Email invite workflow

## Demo Video Approach

Keep the video between 2 and 5 minutes and focus on the user flow, not the code.

Suggested structure:

1. Introduce the project in one sentence
2. Show the live deployed app
3. Sign up as a new user
4. Log in and open the dashboard
5. Create a project
6. Add a team member by email
7. Create and assign tasks
8. Update task status
9. Show role-based behavior briefly
10. End on the live URL and GitHub repo

### Suggested narration

You can say something like:

`This is my Team Task Manager full-stack assignment. Users can sign up, create projects, invite members, assign tasks, and track progress with role-based access. The backend is built with Express and Prisma, the frontend is built with React, and the app is deployed on Railway with PostgreSQL.`

Then continue with:

`I’ll quickly walk through the main flow. First, a user can sign up. After login, they land on the dashboard, where they can create projects and view task summaries. Inside a project, an admin can invite members, manage roles, and create tasks. Tasks can be assigned, updated through their status lifecycle, and tracked through the dashboard including overdue items.`

## Author

- Yudhveer
- GitHub: [yudhveer10](https://github.com/yudhveer10)
