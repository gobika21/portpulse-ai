# PortPulse AI — Congestion Advisory System

A multi-agent system that turns port congestion signals into stakeholder-specific decisions — not just a prediction, but a recommendation with reasoning shown.

Built on top of the domain research and congestion tiers from a port-congestion-prediction dissertation, kept clearly separate: the dissertation is rigorous predictive modeling, this is the agentic decision layer.

## Pipeline

**Monitoring → Classification → Decision-support → Advisory-drafting**

1. **Monitoring agent** — validates an incoming port snapshot (berth occupancy rate, vessel queue length, average waiting time)
2. **Classification agent** — maps the snapshot to a Low/Medium/High/Critical congestion tier
3. **Decision-support agent** — Claude reasoning node producing stakeholder-specific recommendations with cited metrics
4. **Advisory-drafting agent** — formats each recommendation into a persona-specific advisory message (carrier / trucking company / terminal operator)

## Structure

- [`backend/`](backend) — FastAPI + LangGraph agent pipeline, Claude API
- [`frontend/`](frontend) — React (Vite) dashboard

## Quickstart

```bash
# Backend
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add your Anthropic API key
uvicorn app.main:app --reload --port 8000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

## Stack

FastAPI · LangGraph · Claude API · React + Vite
