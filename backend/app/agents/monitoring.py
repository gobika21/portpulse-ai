"""Monitoring agent: validates and normalizes an incoming port snapshot."""

from app.models.schema import AdvisoryState, PortSnapshot


def monitoring_node(state: AdvisoryState) -> AdvisoryState:
    snapshot: PortSnapshot = state["snapshot"]

    required = ("port_name", "berth_occupancy_rate", "vessel_queue_length", "avg_waiting_time_hours")
    missing = [f for f in required if f not in snapshot]
    if missing:
        raise ValueError(f"Snapshot missing fields: {missing}")

    return {"snapshot": snapshot}
