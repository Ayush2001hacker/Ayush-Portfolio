# Ayush portfolio API

Express + MongoDB (Mongoose) for **likes** and **comments** used by the portfolio frontend.

## Environment

Put your variables in **`.env` inside the `backend/` folder** (same directory as `package.json`), or in a **`.env` at the monorepo root** — both are loaded (`backend/.env` first, then root for any keys still unset).

Copy `backend/.env.example` to `backend/.env` and set:

| Variable | Description |
|----------|-------------|
| `CONNECTION_STRING` | MongoDB URI (required) — same idea as `dbConnection.js` in your other project. Include the **database name** after the host (e.g. `/Ayush-portfolio`). |
| `MONGODB_URI` | Optional alternative if you prefer this name; used only when `CONNECTION_STRING` is unset. |
| `FRONTEND_ORIGIN` | CORS origins, comma-separated (defaults include `localhost` / `127.0.0.1` on ports **3000** and **3001**) |
| `PORT` | HTTP port (default `5001`) |
| `ADMIN_EMAIL` | Email allowed for portfolio admin login (default `admin@portfolio.local`). |
| `ADMIN_PASSWORD` | Password for `POST /api/users/login`. Omit to disable admin login (`503`). |
| `ACCESS_TOKEN_SECRET` | JWT signing secret (same role as in your other project’s `validateTokenHandler`). |
| `ADMIN_ACCESS_EXPIRES_IN` | Optional JWT expiry for admin tokens (default `30m`). |

**Database name:** Mongoose uses the database from the URI path (e.g. `...27017/Ayush-portfolio`). Collections `comments` and `likerecords` are created automatically when the app first writes data — you do not need to create those collections manually in the GUI.

## Run locally

```bash
npm install
# Start MongoDB locally, or use Atlas, then:
cp .env.example .env
# edit .env — set MONGODB_URI
npm run dev
```

Health check: `GET http://localhost:5001/health`

## API

Base path: `/api/interactions`

### `GET /:kind/:entityId`

Query: optional `clientId` (stable string per browser, e.g. UUID in `localStorage`).

**Response**

```json
{
  "comments": [
    { "id": "…", "authorName": "Ada", "text": "Nice post", "at": 1710000000000 }
  ],
  "likeCount": 12,
  "liked": true
}
```

- `liked` is whether **this** `clientId` has a like recorded (omit `clientId` for `liked: false` only).

**Kinds** (must match frontend): `blog`, `repository`, `portfolioWork`, `certification`, `experience`.

---

### `POST /:kind/:entityId/comments`

**Body**

```json
{ "authorName": "Ada", "text": "Nice post" }
```

**Response** `201`

```json
{ "comment": { "id": "…", "authorName": "Ada", "text": "Nice post", "at": 1710000000000 } }
```

---

### `POST /:kind/:entityId/like/toggle`

Toggles like for the given `clientId` (one like per client per entity).

**Body**

```json
{ "clientId": "uuid-from-localstorage" }
```

**Response**

```json
{ "likeCount": 12, "liked": true }
```

---

## User-style auth (portfolio admin only — no register)

Same route layout as a typical user API: **`/api/users`**. Credentials are **env-based** (no `User` collection).

### `POST /login`

**Body:** `{ "email": "<ADMIN_EMAIL>", "password": "<ADMIN_PASSWORD>" }`

**Response** `200`: `{ "accessToken": "<jwt>" }` — use `Authorization: Bearer <accessToken>` on `/current`.

**Errors:** `400` missing fields, `401` invalid email/password, `503` if `ADMIN_PASSWORD` or `ACCESS_TOKEN_SECRET` is missing.

### `GET /current`

**Header:** `Authorization: Bearer <accessToken>`

**Middleware:** validates JWT with `ACCESS_TOKEN_SECRET`, then `req.user` is the signed `user` object.

**Response** `200`: `{ "id", "username", "email" }` (same idea as `currentUser` in your other project).

---

## Site content (resume PDF)

Base path: `/api/site`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/settings` | No | JSON: `resumeAvailable`, `updatedAt` (resume `mtimeMs`), `profilePhotoAvailable`, `profilePhotoUpdatedAt` (uploaded avatar `mtimeMs`). |
| `GET` | `/resume` | No | Streams the uploaded PDF (`404` if none). |
| `GET` | `/profile-photo` | No | Streams uploaded profile image (`404` if none). JPEG / PNG / WebP. |
| `POST` | `/resume` | Bearer JWT | `multipart/form-data` field **`resume`** (single PDF, max 12 MB). Replaces the file on disk. |
| `POST` | `/profile-photo` | Bearer JWT | Field **`photo`** — JPEG, PNG, or WebP, max **4 MB**. Replaces any previous `profile-photo.*` in `uploads/`. |
| `GET` | `/highlights` | No | `{ "customItems": Highlight[] }` — admin-added highlights (merged in the app with built-in defaults). Stored as **`highlights-custom.json`**. |
| `PUT` | `/highlights` | Bearer JWT | Body `{ "customItems": Highlight[] }`. Each item must have an id matching `custom-…`. Replaces the whole custom list. |
| `POST` | `/highlight-asset` | Bearer JWT | Field **`file`** — JPEG / PNG / WebP, max **4 MB**. Saved under **`uploads/highlight-assets/{uuid}.{ext}`**; response `{ "filename" }` for `imageSrc` URLs. |
| `GET` | `/highlight-asset/:name` | No | Serves one uploaded highlight image (strict UUID filename). |

Uploaded files live in **`backend/uploads/`** (gitignored): resume, profile photo, **`highlights-custom.json`**, and **`highlight-assets/`** images. Until you upload a resume, the frontend uses the static PDF from `frontend/public`.

---

## Frontend wiring

In **`frontend/.env.local`** (or `.env`), set:

`NEXT_PUBLIC_API_URL=http://localhost:5001`

(without a trailing slash). The Next app loads likes and comments from this API only; it does **not** persist them in `localStorage`. A separate key stores a stable **browser id** for like toggles (`ayush-interaction-client-id`), not the like/comment payloads.
