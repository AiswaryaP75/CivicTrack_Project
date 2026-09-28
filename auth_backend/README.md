# Authentication Module — Community Complaint Management System

This is the authentication and role-based access control backend for the
project (Group 7). It is a standalone Node.js/Express/MongoDB module —
the complaint-reporting, map, and dashboard features will be built as
separate route files that plug into this same server using the
`protect` and `authorizeRoles` middleware shown here.

## Roles

Every account has exactly one role: `citizen`, `officer`, `worker`, or `admin`.

- Public sign-up (`/api/auth/register`) always creates a **citizen** account.
- `officer`, `worker`, and `admin` accounts can only be created by an existing
  admin, via `/api/auth/register-staff`. This prevents anyone from
  self-granting elevated access through the public signup form.

## Setup

```bash
cd auth_backend
npm install
cp .env.example .env
# then edit .env and set MONGO_URI and JWT_SECRET
npm run dev      # requires nodemon (installed as a dev dependency)
# or
npm start
```

You need a running MongoDB instance — either local (`mongodb://127.0.0.1:27017/...`)
or a free MongoDB Atlas cluster (recommended, since it needs no local install).

## API Endpoints

| Method | Endpoint                     | Access           | Description                              |
|--------|-------------------------------|------------------|-------------------------------------------|
| POST   | `/api/auth/register`          | Public           | Sign up as a citizen                      |
| POST   | `/api/auth/login`             | Public           | Log in, returns a JWT                     |
| GET    | `/api/auth/me`                | Any logged-in user | Get the current user's profile         |
| PUT    | `/api/auth/update-password`   | Any logged-in user | Change password                        |
| POST   | `/api/auth/register-staff`    | Admin only       | Create officer/worker/admin accounts      |

## Testing with curl

**Register a citizen:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Anjali Nair","email":"anjali@example.com","password":"secret123"}'
```

**Log in:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"anjali@example.com","password":"secret123"}'
```
This returns a `token` — copy it for the next step.

**Access a protected route:**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer PASTE_YOUR_TOKEN_HERE"
```

**Creating the first admin account:** since `register-staff` itself requires
an admin to already be logged in, create the very first admin directly in
the database (e.g. via MongoDB Compass or `mongosh`), or temporarily comment
out the `authorizeRoles("admin")` check the first time you run the app, then
put it back.

## How this connects to the rest of the project

Any future route (e.g. `POST /api/complaints`) simply imports the same
middleware:

```js
const { protect, authorizeRoles } = require("../middleware/auth");

router.post("/complaints", protect, authorizeRoles("citizen"), createComplaint);
router.put("/complaints/:id/assign", protect, authorizeRoles("officer", "admin"), assignComplaint);
```

`req.user` is available in every protected route handler, already
verified and loaded fresh from the database.

## Security notes (worth mentioning in the presentation)

- Passwords are never stored in plain text — they're hashed with **bcrypt**
  before saving, and the password field is excluded from query results by
  default (`select: false`).
- JWTs are signed with a server-side secret and expire after 7 days
  (configurable via `JWT_EXPIRES_IN`).
- Role checks happen **server-side** on every request — the frontend UI
  may hide buttons a citizen shouldn't see, but the API itself refuses the
  action even if someone calls it directly.
