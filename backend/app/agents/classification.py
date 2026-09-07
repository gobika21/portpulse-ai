"""Classification agent: maps raw metrics to a Low/Medium/High/Critical tier."""

from app.models.schema import AdvisoryState
from app.thresholds import TIER_THRESHOLDS, classify_metric

TIER_ORDER = ["Low", "Medium", "High", "Critical"]

METRIC_LABELS = {
    "berth_occupancy_rate": "how full the port is",
    "vessel_queue_length": "how many ships are waiting",
    "avg_waiting_time_hours": "how long ships are waiting",
}

TIER_SUMMARY = {
    "Low": "Traffic is light and ships are moving through quickly.",
    "Medium": "The port is busier than usual, with some delays starting to build.",
    "High": "The port is significantly congested — expect real delays.",
    "Critical": "The port is severely congested — expect major delays for anyone arriving now.",
}


def _format_value(metric: str, value: float) -> str:
    if metric == "berth_occupancy_rate":
        return f"the port is {round(value * 100)}% full"
    if metric == "vessel_queue_length":
        count = int(value)
        return f"{count} ship{'s' if count != 1 else ''} {'are' if count != 1 else 'is'} waiting"
    return f"ships are waiting an average of {value} hours"


def classification_node(state: AdvisoryState) -> AdvisoryState:
    snapshot = state["snapshot"]

    metric_tiers = {
        "berth_occupancy_rate": classify_metric(
            snapshot["berth_occupancy_rate"], TIER_THRESHOLDS["berth_occupancy_rate"]
        ),
        "vessel_queue_length": classify_metric(
            snapshot["vessel_queue_length"], TIER_THRESHOLDS["vessel_queue_length"]
        ),
        "avg_waiting_time_hours": classify_metric(
            snapshot["avg_waiting_time_hours"], TIER_THRESHOLDS["avg_waiting_time_hours"]
        ),
    }

    # Overall tier = the worst (highest) tier among the three metrics
    overall_tier = max(metric_tiers.values(), key=TIER_ORDER.index)

    driving_metrics = [metric for metric, tier in metric_tiers.items() if tier == overall_tier]
    driving_facts = ", ".join(_format_value(metric, snapshot[metric]) for metric in driving_metrics)

    reasoning = f"{TIER_SUMMARY[overall_tier]} This is mainly because {driving_facts}."

    return {"tier": overall_tier, "tier_reasoning": reasoning}
