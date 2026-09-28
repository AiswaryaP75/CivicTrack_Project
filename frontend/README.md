# CivicTrack — Frontend (Authentication UI)

React frontend for the Community Complaint Management System (Group 7).
This covers the authentication piece: register, login, a role-aware
dashboard, and an admin-only staff management page. It talks to the
`auth_backend` API.

## Setup

```bash
cd frontend
npm install
npm run dev
```

Runs on **http://localhost:5173** by default (Vite's dev server).

**The backend must also be running** on `http://localhost:5000` — see
`auth_backend/README.md`. If you deploy the backend somewhere else, update
`API_BASE` in `src/api/client.js`.

## What's included

- **Login / Register pages** — call the real `/api/auth/login` and
  `/api/auth/register` endpoints.
- **Dashboard** — shows the logged-in user's profile, a live view of
  their JWT (decoded client-side for display only — the backend is
  still the one enforcing everything), and a permissions checklist
  showing exactly what their role can and can't do.
- **Admin → Staff accounts page** — only reachable by an `admin`
  account; lets you create officer / field worker / admin accounts via
  `/api/auth/register-staff`.
- **Route protection** — `ProtectedRoute` redirects to `/login` if
  there's no valid session, and can restrict a route to specific roles
  (used on the admin staff page).

## Demoing this in your presentation

1. Start both servers (`auth_backend` on :5000, `frontend` on :5173).
2. Register a new citizen account on the sign-up page.
3. Show the Dashboard — point out the role badge, the permission
   checklist, and the actual JWT sitting in the token panel.
4. Manually create an admin account (see `auth_backend/README.md` for
   how to bootstrap the first admin), log in as that admin, and show
   the Staff Accounts page creating an officer or field worker account.
5. Log in as that new officer/worker account and show the dashboard's
   permission list changing based on role — the same UI, different
   allowed actions, all enforced by the backend rather than hidden in
   the frontend.

## Notes

- The JWT is stored in `localStorage` for this demo. This is standard
  for a project at this stage; a production version might move to an
  httpOnly cookie instead to reduce XSS exposure.
- This frontend only covers authentication. Complaint reporting, the
  map, and the officer/worker dashboards are separate features to be
  built next, using the same `protect` / `authorizeRoles` pattern
  already shown in `auth_backend/routes/exampleProtectedRoutes.js`.
