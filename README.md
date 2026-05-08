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

# The Ballroom Forum by RayWretch

A React + Vite forum-style web app with a Rails JSON API. In development, Vite proxies `/api` to Rails on port **3000**.

## Prerequisites

- **Node.js** (frontend)
- **Ruby** ≥ **3.2** (see `backend/.ruby-version`; use [RubyInstaller](https://rubyinstaller.org/) on Windows and enable **Add Ruby to PATH**)
- **Bundler**: `gem install bundler`
- **PostgreSQL** (running locally; defaults match `backend/.env.example`)

## Setup

**1. Frontend** (repository root):

```bash
npm install
```

**2. Backend**:

```bash
cd backend
bundle install
```

Copy `backend/.env.example` to `backend/.env` (Windows: `copy .env.example .env`; Unix/macOS: `cp .env.example .env`).

Edit `.env` if your Postgres user, password, or host differs.

```bash
ruby bin/rails db:prepare
ruby bin/rails db:seed
```

**3. Run two terminals**

Terminal A — API (from repository root):

```bash
npm run dev:api
```

Rails listens at **http://127.0.0.1:3000**.

Terminal B — frontend:

```bash
npm run dev
```

Open **http://localhost:5173**. Requests to `/api/*` are proxied to Rails.

Without the API running, `/api` calls fail (for example `ECONNREFUSED` on port 3000).

### Quick smoke check

1. Open the app, sign up or sign in.
2. Open a board, create a thread, reply once.
3. Confirm counts on the home board list update after refresh.

## Build

```bash
npm run build
npm run preview
```

## License

2026 RayWretch | h4nds | JN | EnWretched. All Rights Reserved
