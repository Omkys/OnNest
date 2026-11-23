# OnNests

Multi-tenant property operations SaaS with organization-scoped data isolation.

## Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS, React Hook Form, Zod, TanStack Query, Socket.IO client
- **Backend:** Node.js, Express, TypeScript, JWT auth, Socket.IO
- **Database:** MongoDB + Mongoose (org-scoped indexes)
- **Infra:** Docker Compose (MongoDB + Redis)

## Multi-tenant model

1. **Sign up** creates a new `Organization` (`organizationId` like `org_xxxxxxxx`) and an **owner** user in one flow.
2. Every `User` document is scoped by `organizationId` (unique email **per organization**).
3. JWT embeds `organizationId` + role for RBAC and tenant isolation.
4. Socket.IO rooms use `org:<mongoObjectId>` so realtime events stay tenant-scoped.

## Quick start

### 1. Start MongoDB (and Redis)

```bash
docker compose up -d mongodb redis
```

Or point `backend/.env` `MONGODB_URI` at any local MongoDB instance.

### 2. Install & run API

```bash
cd backend
npm install
npm run dev
```

API: `http://localhost:4000`

### 3. Install & run frontend

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:3000`

## Auth pages

| Route | Purpose |
|-------|---------|
| `/sign-up` | Organization name, first/last name, email, password, confirm password |
| `/sign-in` | Email, password, optional Organization ID |
| `/dashboard` | Tenant workspace + realtime connection status |

Required fields show a red asterisk (`*`).

## API

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/signup` | Create organization + owner |
| `POST` | `/api/auth/signin` | Sign in (org-scoped) |
| `GET` | `/api/auth/me` | Current user + organization |
| `POST` | `/api/auth/logout` | Clear session cookie |

## Environment

Copy `backend/.env.example` → `backend/.env` and `frontend/.env.example` → `frontend/.env.local`.
