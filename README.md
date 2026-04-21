```
    ▄▄▄        ▄▄ ▄▄                               ▄▄
   ██▀▀█▄       ██ ██                             ██
   ██ ▄█▀       ██ ██ ▄                ▄         ▄██▄      ▄          ▄
   ██▀▀█▄ ▄▀▀█▄ ██ ██ ████▄▄███▄ ▄███▄ ███▄███▄   ██ ▄███▄ ████▄██ ██ ███▄███▄
 ▄ ██  ▄█ ▄█▀██ ██ ██ ██   ██ ██ ██ ██ ██ ██ ██   ██ ██ ██ ██   ██ ██ ██ ██ ██
 ▀██████▀▄▀█▄██▄██▄██▄█▀  ▄▀███▀▄▀███▀▄██ ██ ▀█  ▄██▄▀███▀▄█▀  ▄▀██▀█▄██ ██ ▀█
                                                  ██
                                                 ▀▀
```

# Ballroom

A React + Vite forum-style web app with a Rails JSON API. The Vite dev server proxies `/api` to Rails on port **3000**.

## Prerequisites

- **Node.js** (for the frontend)
- **Ruby** and **Bundler** (for the API)
- **PostgreSQL** (see `backend/.env.example` for typical connection settings)

## Setup

**Frontend** (repo root):

```bash
npm install
```

**Backend**:

```bash
cd backend
bin/setup
```

Copy `backend/.env.example` to `backend/.env` and set `SECRET_KEY_BASE` (and database credentials if they differ from the defaults).

## Development

Run **two** processes:

1. **API** — from the repo root:

   ```bash
   npm run dev:api
   ```

   Starts Rails on `http://127.0.0.1:3000`.

2. **Frontend** — in another terminal:

   ```bash
   npm run dev
   ```

   Opens the Vite app (default `http://localhost:5173`). Requests to `/api/*` are proxied to Rails.

Without the API running, auth and other `/api` calls will fail with a network error.

## Build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## License

Private / specify your license here.
