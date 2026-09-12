from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.graph import run_pipeline
from app.live.aisstream_client import (
    AISStreamError,
    build_port_snapshot,
    get_all_live_vessel_queues,
    get_live_vessel_queue,
    list_ports,
    start_collector,
    stop_collector,
)
from app.models.schema import PortSnapshot
from app.scenarios import SCENARIOS

app = FastAPI(title="BerthIQ")

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


@app.get("/live/ports")
def live_ports(lang: str = "en"):
    """List of ports tracked by the live board, with whether each has confirmed AIS coverage."""
    return list_ports(lang=lang)


@app.get("/live/vessel-queue")
def live_vessel_queue(port: str, positions: bool = False, lang: str = "en"):
    """Live vessel-queue proxy via AIS (aisstream.io) for a single port.

    Berth occupancy and average waiting time are not publicly exposed by
    DP World or other port authorities, so those remain estimated/manual —
    only vessel queue length is backed by a live feed here. Anchored vessels
    report infrequently, so this reads from a continuously-updated
    background cache rather than blocking per request; `warming_up` is true
    until enough time has passed to reliably observe anchored vessels.

    Pass `positions=true` to also include each tracked ship's live lat/lon
    (for the map view) — omitted by default to keep the board-view payload
    small.
    """
    try:
        return get_live_vessel_queue(port, include_positions=positions, lang=lang)
    except AISStreamError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get("/live/vessel-queue/all")
def live_vessel_queue_all(lang: str = "en"):
    """Live vessel-queue snapshot for every tracked port — powers the board view."""
    return get_all_live_vessel_queues(lang=lang)


@app.post("/advisory")
def advisory(snapshot: PortSnapshot):
    try:
        result = run_pipeline(dict(snapshot))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return {
        "tier": result["tier"],
        "tier_reasoning": result["tier_reasoning"],
        "precedents": result.get("precedents", []),
        "recommendations": result["recommendations"],
        "advisories": result["advisories"],
    }


@app.get("/live/advisory")
def live_advisory(port: str, lang: str = "en"):
    """Run the full agent pipeline (monitoring -> ... -> advisory-drafting) on live AIS data.

    `vessel_queue_length` is a real live reading; `berth_occupancy_rate` and
    `avg_waiting_time_hours` have no public live source and are estimated
    from the queue length (see `build_port_snapshot`) — both the snapshot
    used and which fields were estimated are returned alongside the result.
    """
    try:
        snapshot = build_port_snapshot(port, lang=lang)
    except AISStreamError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    pipeline_input = {k: v for k, v in snapshot.items() if k not in ("estimated_fields", "live_coverage", "warming_up")}

    try:
        result = run_pipeline(pipeline_input)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return {
        "snapshot": snapshot,
        "tier": result["tier"],
        "tier_reasoning": result["tier_reasoning"],
        "precedents": result.get("precedents", []),
        "recommendations": result["recommendations"],
        "advisories": result["advisories"],
    }
