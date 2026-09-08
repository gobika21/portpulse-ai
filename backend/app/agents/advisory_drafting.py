"""Advisory-drafting agent: formats each recommendation into a persona-specific report."""

from app.claude_client import ask_claude
from app.models.schema import AdvisoryState

SYSTEM_PROMPT = """You draft short, clear advisory messages for port-logistics stakeholders. \
Given a persona, a recommended action, and the reasoning behind it, write a 2-4 sentence \
advisory message addressed directly to that stakeholder. Be concrete and actionable, and \
reference the underlying data point(s) that led to the recommendation. Plain text only, no \
markdown, no JSON.
"""

ARABIC_INSTRUCTION = "\n\nWrite the advisory message in Modern Standard Arabic."


def advisory_drafting_node(state: AdvisoryState) -> AdvisoryState:
    snapshot = state["snapshot"]
    language = state.get("language", "en")
    system_prompt = SYSTEM_PROMPT + (ARABIC_INSTRUCTION if language == "ar" else "")
    advisories: dict[str, str] = {}

    for rec in state["recommendations"]:
        user_prompt = (
            f"Port: {snapshot['port_name']}\n"
            f"Persona: {rec['persona']}\n"
            f"Recommended action: {rec['action']}\n"
            f"Reasoning: {rec['reasoning']}\n"
        )
        advisories[rec["persona"]] = ask_claude(system_prompt, user_prompt, max_tokens=300)

    return {"advisories": advisories}
