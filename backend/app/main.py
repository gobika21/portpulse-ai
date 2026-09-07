from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.graph import run_pipeline
from app.live.aisstream_client import AISStreamError, get_live_vessel_queue, start_collector, stop_collector
from app.models.schema import PortSnapshot
from app.scenarios import SCENARIOS

app = FastAPI(title="PortPulse AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    start_collector()


@app.on_event("shutdown")
async def on_shutdown():
    stop_collector()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/scenarios")
def list_scenarios():
    return SCENARIOS


@app.get("/live/vessel-queue")
def live_vessel_queue(port: str = "jebel_ali"):
    """Live vessel-queue proxy via AIS (aisstream.io).

    Berth occupancy and average waiting time are not publicly exposed by
    DP World, so those remain estimated/manual — only vessel queue length
    is backed by a live feed here. Anchored vessels report infrequently, so
    this reads from a continuously-updated background cache rather than
    blocking per request; `warming_up` is true until enough time has passed
    to reliably observe anchored vessels.

    `port` defaults to Jebel Ali (the real target, currently with little to
    no free AIS receiver coverage) — pass `port=rotterdam` for a live proof
    panel on a port with dense free coverage, using the same code path.
    """
    try:
        return get_live_vessel_queue(port)
    except AISStreamError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


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
