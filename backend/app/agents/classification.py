"""Classification agent: maps raw metrics to a Low/Medium/High/Critical tier."""

from app.models.schema import AdvisoryState
from app.thresholds import TIER_THRESHOLDS, classify_metric

TIER_ORDER = ["Low", "Medium", "High", "Critical"]

TIER_SUMMARY = {
    "en": {
        "Low": "Traffic is light and ships are moving through quickly.",
        "Medium": "The port is busier than usual, with some delays starting to build.",
        "High": "The port is significantly congested — expect real delays.",
        "Critical": "The port is severely congested — expect major delays for anyone arriving now.",
    },
    "ar": {
        "Low": "الحركة في الميناء سلسة والسفن تتحرك بسرعة.",
        "Medium": "الميناء أكثر ازدحامًا من المعتاد، وبدأت بعض التأخيرات بالتراكم.",
        "High": "الميناء يشهد ازدحامًا كبيرًا — يُتوقع تأخير حقيقي.",
        "Critical": "الميناء يعاني من ازدحام شديد — يُتوقع تأخير كبير لأي سفينة تصل الآن.",
    },
}

REASONING_JOIN = {
    "en": "{summary} This is mainly because {facts}.",
    "ar": "{summary} ويعود ذلك أساسًا إلى أن {facts}.",
}


def _format_value(metric: str, value: float, language: str) -> str:
    if language == "ar":
        if metric == "berth_occupancy_rate":
            return f"الميناء ممتلئ بنسبة {round(value * 100)}%"
        if metric == "vessel_queue_length":
            return f"{int(value)} سفينة تنتظر"
        return f"متوسط انتظار السفن {value} ساعة"

    if metric == "berth_occupancy_rate":
        return f"the port is {round(value * 100)}% full"
    if metric == "vessel_queue_length":
        count = int(value)
        return f"{count} ship{'s' if count != 1 else ''} {'are' if count != 1 else 'is'} waiting"
    return f"ships are waiting an average of {value} hours"


def classification_node(state: AdvisoryState) -> AdvisoryState:
    snapshot = state["snapshot"]
    language = state.get("language", "en")

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
    driving_facts = "، ".join(_format_value(metric, snapshot[metric], language) for metric in driving_metrics) \
        if language == "ar" else \
        ", ".join(_format_value(metric, snapshot[metric], language) for metric in driving_metrics)

    reasoning = REASONING_JOIN[language].format(summary=TIER_SUMMARY[language][overall_tier], facts=driving_facts)

    return {"tier": overall_tier, "tier_reasoning": reasoning, "driving_metrics": driving_metrics}
