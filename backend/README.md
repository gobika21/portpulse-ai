# PortPulse AI — Backend

Multi-agent congestion advisory pipeline: **Monitoring → Classification → Decision-support → Advisory-drafting**, orchestrated with LangGraph and reasoned over by the Claude API.

## Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add your Anthropic API key
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
- `POST /advisory` — run the full pipeline on a `PortSnapshot` JSON body

## Agents

| Agent | File | Job |
|---|---|---|
| Monitoring | `app/agents/monitoring.py` | Validates the incoming port snapshot |
| Classification | `app/agents/classification.py` | Maps metrics to Low/Medium/High/Critical tiers |
| Decision-support | `app/agents/decision_support.py` | Claude reasoning node — per-persona recommendations with cited metrics |
| Advisory-drafting | `app/agents/advisory_drafting.py` | Formats each recommendation into a persona-specific advisory message |

Tier thresholds live in `app/thresholds.py` — replace the placeholders with the dissertation's validated values.
