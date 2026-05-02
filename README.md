# Team Task Manager

Full-stack task management app for managing projects, members, and tasks with role-based access control.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL + Prisma
- Auth: JWT

## Features

- User signup and login
- Project creation and project listing
- Admin/member role-based access
- Team member invitation and role updates
- Task creation, assignment, update, and deletion
- Dashboard with project stats and overdue task tracking

## Project Structure

```text
client/
server/
```

## Environment Variables

### Server

Copy `server/.env.example` to `server/.env` and update:

```env
PORT=5000
CLIENT_URL=http://localhost:3000
JWT_SECRET=replace-with-a-strong-secret
DATABASE_URL="postgresql://postgres:password@localhost:5432/team_task_manager?schema=public"
```

### Client

Copy `client/.env.example` to `client/.env` and update:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## API Modules

- Auth routes in `server/src/routes/auth.routes.js`
- Dashboard route in `server/src/routes/dashboard.routes.js`
- Project routes in `server/src/routes/projects.routes.js`
- Task routes in `server/src/routes/tasks.routes.js`

## Next Steps

1. Install dependencies in `client` and `server`.
2. Set up PostgreSQL and run Prisma migration.
3. Run backend and frontend locally.
4. Deploy backend and frontend on Railway.
