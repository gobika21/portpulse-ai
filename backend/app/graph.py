"""LangGraph wiring: Monitoring -> Classification -> Precedent-retrieval -> Decision-support -> Advisory-drafting."""

from langgraph.graph import END, StateGraph

from app.agents.advisory_drafting import advisory_drafting_node
from app.agents.classification import classification_node
from app.agents.decision_support import decision_support_node
from app.agents.monitoring import monitoring_node
from app.agents.precedent_retrieval import precedent_retrieval_node
from app.models.schema import AdvisoryState


def build_graph():
    graph = StateGraph(AdvisoryState)

    graph.add_node("monitoring", monitoring_node)
    graph.add_node("classification", classification_node)
    graph.add_node("precedent_retrieval", precedent_retrieval_node)
    graph.add_node("decision_support", decision_support_node)
    graph.add_node("advisory_drafting", advisory_drafting_node)

    graph.set_entry_point("monitoring")
    graph.add_edge("monitoring", "classification")
    graph.add_edge("classification", "precedent_retrieval")
    graph.add_edge("precedent_retrieval", "decision_support")
    graph.add_edge("decision_support", "advisory_drafting")
    graph.add_edge("advisory_drafting", END)

    return graph.compile()


def run_pipeline(snapshot: dict) -> dict:
    app_graph = build_graph()
    return app_graph.invoke({"snapshot": snapshot})
