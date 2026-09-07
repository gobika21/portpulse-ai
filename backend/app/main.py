from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.graph import run_pipeline
from app.models.schema import PortSnapshot
from app.scenarios import SCENARIOS

app = FastAPI(title="PortPulse AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/scenarios")
def list_scenarios():
    return SCENARIOS


@app.post("/advisory")
def advisory(snapshot: PortSnapshot):
    try:
        result = run_pipeline(dict(snapshot))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return {
        "tier": result["tier"],
        "tier_reasoning": result["tier_reasoning"],
        "recommendations": result["recommendations"],
        "advisories": result["advisories"],
    }
