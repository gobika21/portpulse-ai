"""Synthetic port-snapshot scenario presets, one per congestion tier."""

from app.models.schema import PortSnapshot

SCENARIOS: dict[str, PortSnapshot] = {
    "low": {
        "port_name": "Jebel Ali",
        "berth_occupancy_rate": 0.35,
        "vessel_queue_length": 1,
        "avg_waiting_time_hours": 2,
    },
    "medium": {
        "port_name": "Jebel Ali",
        "berth_occupancy_rate": 0.6,
        "vessel_queue_length": 5,
        "avg_waiting_time_hours": 8,
    },
    "high": {
        "port_name": "Jebel Ali",
        "berth_occupancy_rate": 0.8,
        "vessel_queue_length": 12,
        "avg_waiting_time_hours": 18,
    },
    "critical": {
        "port_name": "Jebel Ali",
        "berth_occupancy_rate": 0.95,
        "vessel_queue_length": 22,
        "avg_waiting_time_hours": 30,
    },
}
