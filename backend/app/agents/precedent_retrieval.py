"""Precedent-retrieval agent (RAG): grounds the tier in similar past episodes."""

from app.models.schema import AdvisoryState
from app.rag.retriever import retrieve

TOP_K = 2


def precedent_retrieval_node(state: AdvisoryState) -> AdvisoryState:
    snapshot = state["snapshot"]
    tier = state["tier"]
    tier_reasoning = state["tier_reasoning"]

    query = f"{snapshot['port_name']} {tier} congestion. {tier_reasoning}"
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
