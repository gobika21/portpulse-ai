"""Decision-support agent: Claude reasoning node producing per-persona recommendations."""

import json
import re

from app.claude_client import ask_claude
from app.models.schema import AdvisoryState

SYSTEM_PROMPT = """You are a port operations decision-support analyst. Given a congestion \
snapshot, its tier, the reasoning behind that tier, and summaries of comparable past \
congestion episodes, produce concrete recommendations for three stakeholders: a carrier, \
a trucking company, and a terminal operator.

Cite the specific numbers that triggered each recommendation (e.g. "45 ships waiting" or \
"95% full"), but write for a general, non-technical reader. Do not use snake_case field \
names, code-style variable names, or jargon like "berth_occupancy_rate" anywhere in your \
output — always spell things out in plain English (e.g. say "the port is 95% full", never \
"berth_occupancy_rate=0.95"). Do not give a flat "safe/unsafe" verdict — explain the reasoning.

If a past episode below is genuinely relevant, you may reference what worked there (e.g. \
"during a similar backlog at another port, carriers that rebooked early avoided the worst \
delays"), but only if it's actually relevant — never force a comparison, never state it as \
fact for the current port, and never fabricate a precedent beyond what's given.

Respond ONLY with valid JSON, an array of exactly 3 objects, each shaped as:
{"persona": "carrier" | "trucking_company" | "terminal_operator", "action": "...", "reasoning": "..."}
"""

ARABIC_INSTRUCTION = (
    "\n\nWrite the \"action\" and \"reasoning\" text in Modern Standard Arabic. Keep the JSON "
    "keys and the \"persona\" values themselves in English exactly as specified above — only "
    "the text content is Arabic."
)


def decision_support_node(state: AdvisoryState) -> AdvisoryState:
    snapshot = state["snapshot"]
    tier = state["tier"]
    tier_reasoning = state["tier_reasoning"]
    precedents = state.get("precedents", [])
    language = state.get("language", "en")
    system_prompt = SYSTEM_PROMPT + (ARABIC_INSTRUCTION if language == "ar" else "")

    precedent_text = (
        "\n".join(
            f"- {p['port_name']} ({p['tier']}): {p['summary']} What helped: {p['outcome']}"
            for p in precedents
        )
        or "None found."
    )

    user_prompt = (
        f"Port: {snapshot['port_name']}\n"
        f"Congestion level: {tier}\n"
        f"Why: {tier_reasoning}\n"
        f"How full the port is: {round(snapshot['berth_occupancy_rate'] * 100)}%\n"
        f"Ships currently waiting: {snapshot['vessel_queue_length']}\n"
        f"Average wait time: {snapshot['avg_waiting_time_hours']} hours\n\n"
        f"Comparable past episodes:\n{precedent_text}\n"
    )

    raw = ask_claude(system_prompt, user_prompt)
    recommendations = json.loads(_strip_code_fence(raw))

    return {"recommendations": recommendations}


def _strip_code_fence(text: str) -> str:
    match = re.search(r"```(?:json)?\s*(.*?)\s*```", text, re.DOTALL)
    return match.group(1) if match else text
