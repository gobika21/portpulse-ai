# PortPulse AI — Frontend

Standalone React (Vite) dashboard for the PortPulse congestion advisory pipeline. Separate from the existing `port-research-app` notebook frontend at the repo root.

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_PORTPULSE_API_URL if not using the default
npm run dev
```

Open http://localhost:5174

Requires the [backend](../backend) running at `VITE_PORTPULSE_API_URL` (defaults to `http://localhost:8000`).
