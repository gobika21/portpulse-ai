"""Classification agent: maps raw metrics to a Low/Medium/High/Critical tier."""

from app.models.schema import AdvisoryState
from app.thresholds import TIER_THRESHOLDS, classify_metric

TIER_ORDER = ["Low", "Medium", "High", "Critical"]


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

    reasoning_parts = [f"{metric}={snapshot[metric]} -> {tier}" for metric, tier in metric_tiers.items()]
    reasoning = f"Overall tier is {overall_tier} (driven by worst metric). " + "; ".join(reasoning_parts)

    return {"tier": overall_tier, "tier_reasoning": reasoning}
