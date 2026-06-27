# Live Cricket Hub

A full-stack live cricket dashboard built with **React 19 + Vite** (frontend) and **Node.js + Express** (backend), powered by the Cricbuzz RapidAPI.

## What's New (v2)

- **Clickable match cards** — each card opens a full Match Details page
- **Match Details page** with scorecard (batting + bowling), commentary, match info, and live scores
- **Loading skeletons** — smooth shimmer placeholders while data loads
- **Live badge** — red pulsing dot on live matches
- **Auto-refresh** — scores silently refresh every 2 minutes
- **Dark mode persisted** via localStorage
- **Graceful fallbacks** — missing API data shows informative placeholders, not broken UI
- **Sticky header** with backdrop blur
- **Modular codebase** — hooks, components, pages separated cleanly

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite 8, Tailwind CSS v4, Lucide React |
| Backend | Node.js, Express 5, Axios, NodeCache |
| API | Cricbuzz via RapidAPI |

## Project Structure

```
Cricket_Web/
├── backend/
│   ├── server.js          # Express API (3 endpoints)
│   ├── .env               # API key (not committed)
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.jsx            # Root, client-side navigation
    │   ├── hooks/
    │   │   ├── useDarkMode.js
    │   │   └── useMatches.js  # useMatches + useMatchDetail
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── MatchCard.jsx  # Card + skeleton
    │   │   ├── StatsBar.jsx
    │   │   ├── Scorecard.jsx  # Batting + bowling tables
    │   │   └── Commentary.jsx
    │   └── pages/
    │       ├── Dashboard.jsx
    │       └── MatchDetail.jsx
    ├── vite.config.js
    └── .env.example
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Server health + API key status |
| GET | `/api/live` | Live match list |
| GET | `/api/match/:id` | Full match details + scorecard |
| GET | `/api/recent` | Recently completed matches |

## Local Setup

```bash
# Backend
cd backend
npm install
cp .env.example .env   # add your CRICKET_API_KEY
npm run dev

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env   # set VITE_API_BASE_URL=http://localhost:5000
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Deployment

### Backend (Render)
Set environment variables:
- `CRICKET_API_KEY` — your RapidAPI key
- `RAPIDAPI_HOST` — `cricbuzz-cricket.p.rapidapi.com`
- `CLIENT_ORIGIN` — your frontend URL (e.g. `https://your-app.vercel.app`)
- `PORT` — Render sets this automatically

### Frontend (Vercel)
Set environment variables:
- `VITE_API_BASE_URL` — your Render backend URL

## API Key Notes

Get a free/paid key at [RapidAPI Cricbuzz](https://rapidapi.com/cricketapilive/api/cricbuzz-cricket).

Without a key, the app shows **demo scorecards** with a banner. The demo mode is intentional for portfolio viewing without burning API quota.

## API Limitations & Fallbacks

| Feature | If API Unavailable |
|---------|-------------------|
| Scorecard | "Scorecard data not available" message |
| Commentary | "Commentary not available" message |
| Match info fields | Fields omitted from info grid |
| Entire backend | Client-side demo matches displayed |
