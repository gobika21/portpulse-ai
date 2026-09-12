# BerthIQ — Backend

Multi-agent congestion advisory pipeline: **Monitoring → Classification → Decision-support → Advisory-drafting**, orchestrated with LangGraph and reasoned over by the Claude API.

## Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add your Anthropic API key and (optionally) an aisstream.io key
```

## Run the pipeline from the CLI

```bash
python cli.py low       # or medium | high | critical
```

## Run the API server

```bash
uvicorn app.main:app --reload --port 8000
```

- `GET /health` — liveness check
- `GET /scenarios` — synthetic snapshot presets
- `GET /live/vessel-queue?port=jebel_ali|rotterdam` — live AIS vessel-queue proxy (see below)
- `POST /advisory` — run the full pipeline on a `PortSnapshot` JSON body

## Live data (partial)

DP World doesn't expose a public API for berth occupancy or internal queue data — those metrics stay
manual/estimated in this app. What IS live: vessel positions via the free [aisstream.io](https://aisstream.io)
AIS feed, geofenced around a port, used as a proxy for "vessels currently anchored/waiting nearby."

**Known limitation:** aisstream.io is a volunteer-receiver network, not satellite AIS — coverage depends on
people running their own antennas. Testing confirms the Persian Gulf / Jebel Ali currently has little to no
free receiver coverage, so `port=jebel_ali` will typically show 0 vessels. `port=rotterdam` is included as a
live proof-of-capability panel — same code path, pointed at a region with dense free coverage — to demonstrate
the integration genuinely works. A production version would need a paid satellite-AIS provider (e.g.
MarineTraffic, Datalastic) for real Gulf coverage.

The collector runs as a background task (`app/live/aisstream_client.py`), started at app startup, because
anchored vessels only broadcast a position update every ~2-3 minutes — a per-request blocking fetch would
almost always see nothing.

## Agents

| Agent | File | Job |
|---|---|---|
| Monitoring | `app/agents/monitoring.py` | Validates the incoming port snapshot |
| Classification | `app/agents/classification.py` | Maps metrics to Low/Medium/High/Critical tiers |
| Decision-support | `app/agents/decision_support.py` | Claude reasoning node — per-persona recommendations with cited metrics |
| Advisory-drafting | `app/agents/advisory_drafting.py` | Formats each recommendation into a persona-specific advisory message |

Tier thresholds live in `app/thresholds.py` — replace the placeholders with the dissertation's validated values.
