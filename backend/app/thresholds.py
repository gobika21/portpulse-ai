"""Congestion tier thresholds.

Placeholder values based on typical UNCTAD-style port KPIs — replace with the
exact thresholds validated in the dissertation before the demo.
"""

TIER_THRESHOLDS = {
    "berth_occupancy_rate": {"Low": 0.5, "Medium": 0.7, "High": 0.85},
    "vessel_queue_length": {"Low": 3, "Medium": 8, "High": 15},
    "avg_waiting_time_hours": {"Low": 4, "Medium": 12, "High": 24},
}


def classify_metric(value: float, bounds: dict) -> str:
    if value < bounds["Low"]:
        return "Low"
    if value < bounds["Medium"]:
        return "Medium"
    if value < bounds["High"]:
        return "High"
    return "Critical"
