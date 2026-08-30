# Mini Marketplace — Frontend

Next.js frontend for the Mini Marketplace MVP. Connects to a REST API backend with JWT authentication and PostgreSQL.

## Features

- **Role-based access** — Buyer, Seller, Admin
- **Buyer** — Browse listings, place orders, view order history
- **Seller** — Create, edit, delete listings; view orders on their products
- **Admin** — View all orders, approve/reject (from PENDING), complete (from APPROVED)
- **Order status flow** — `PENDING` → `APPROVED` → `COMPLETED` or `PENDING` → `REJECTED`

## Prerequisites

- Node.js 18+
- Backend API running at `http://localhost:5080` (PostgreSQL + REST + JWT)

## Setup

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Copy environment config:

```bash
cp .env.local.example .env.local
```

3. Start the dev server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) — you'll land on the **login** page. After login, you're redirected to the **dashboard**.

## App Flow

1. `/` → redirects to `/login` (guest) or `/dashboard` (logged in)
2. Login / Register → `/dashboard`
3. Authenticated pages use a **CRM-style layout** (sidebar + header)

## Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend REST API base URL (default: `http://localhost:5080`) |

## Test Flow

1. Start backend on port 5080
2. Register first admin (only works once):
   ```json
   POST /api/auth/register
   { "email": "admin@marketplace.com", "password": "admin123", "name": "Admin", "role": "ADMIN" }
   ```
3. Register a seller and a buyer via `/register`
4. Seller creates listings at `/my-listings`
5. Buyer browses `/marketplace` and places orders on listing detail pages
6. Admin manages orders at `/admin`

## Project Structure

```
app/
  page.tsx              # Redirect to login or dashboard
  login/ register/      # Auth (no sidebar)
  (app)/                # Authenticated routes (sidebar + header)
    layout.tsx
    dashboard/          # Landing after login
    marketplace/        # Browse listings
    listings/[id]/
    my-orders/ my-listings/ seller-orders/ admin/ profile/
components/
  layout/               # Sidebar, Header, AppShell
  ui/                   # Button, Input, Field, etc.
context/                # AuthContext (JWT in localStorage)
hooks/                  # useAuth
lib/
  api/                  # REST client + endpoint functions
  token.ts              # JWT storage helpers
types/                  # User, Listing, Order, Role enums
```

## API Integration

All requests use `Authorization: Bearer <token>` for protected routes. Responses follow:

```json
{ "success": true, "data": ... }
{ "success": false, "message": "Error description" }
```

Errors from the API `message` field are shown in the UI.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
