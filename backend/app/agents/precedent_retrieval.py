"""Precedent-retrieval agent (RAG): grounds the tier in similar past episodes."""

from app.models.schema import AdvisoryState
from app.rag.retriever import retrieve

TOP_K = 2

# `tier_reasoning` is templated boilerplate ("the port is X% full, N ships
# waiting...") that reads almost the same for every scenario at a given tier,
# so it carries little signal for matching against the corpus's narrative
# summaries. Mapping the metric that actually drove the tier onto real
# domain keywords gives the retriever something concrete to differentiate
# a queue-driven backlog from a berth-capacity crunch or a pure delay issue.
DRIVING_METRIC_KEYWORDS = {
    "berth_occupancy_rate": "berth capacity terminal full outage shutdown",
    "vessel_queue_length": "queue backlog vessels anchored offshore",
    "avg_waiting_time_hours": "waiting delay schedule detention demurrage",
}


def precedent_retrieval_node(state: AdvisoryState) -> AdvisoryState:
    snapshot = state["snapshot"]
    tier = state["tier"]
    tier_reasoning = state["tier_reasoning"]
    driving_metrics = state.get("driving_metrics", [])

    keywords = " ".join(DRIVING_METRIC_KEYWORDS[m] for m in driving_metrics if m in DRIVING_METRIC_KEYWORDS)
    query = f"{snapshot['port_name']} {tier} congestion. {tier_reasoning} {keywords}"
    precedents = retrieve(query, tier, k=TOP_K)

    return {
        "precedents": [
            {
                "id": p["id"],
                "port_name": p["port_name"],
                "tier": p["tier"],
                "summary": p["summary"],
                "outcome": p["outcome"],
            }
            for p in precedents
        ]
    }
