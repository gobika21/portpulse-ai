"""Decision-support agent: Claude reasoning node producing per-persona recommendations."""

import json
import re

from app.claude_client import ask_claude
from app.models.schema import AdvisoryState

SYSTEM_PROMPT = """You are a port operations decision-support analyst. Given a congestion \
snapshot, its tier, and the reasoning behind that tier, produce concrete recommendations \
for three stakeholders: a carrier, a trucking company, and a terminal operator.

Cite the specific numbers that triggered each recommendation (e.g. "45 ships waiting" or \
"95% full"), but write for a general, non-technical reader. Do not use snake_case field \
names, code-style variable names, or jargon like "berth_occupancy_rate" anywhere in your \
output — always spell things out in plain English (e.g. say "the port is 95% full", never \
"berth_occupancy_rate=0.95"). Do not give a flat "safe/unsafe" verdict — explain the reasoning.

Respond ONLY with valid JSON, an array of exactly 3 objects, each shaped as:
{"persona": "carrier" | "trucking_company" | "terminal_operator", "action": "...", "reasoning": "..."}
"""


def decision_support_node(state: AdvisoryState) -> AdvisoryState:
    snapshot = state["snapshot"]
    tier = state["tier"]
    tier_reasoning = state["tier_reasoning"]

    user_prompt = (
        f"Port: {snapshot['port_name']}\n"
        f"Congestion level: {tier}\n"
        f"Why: {tier_reasoning}\n"
        f"How full the port is: {round(snapshot['berth_occupancy_rate'] * 100)}%\n"
        f"Ships currently waiting: {snapshot['vessel_queue_length']}\n"
        f"Average wait time: {snapshot['avg_waiting_time_hours']} hours\n"
    )

    raw = ask_claude(SYSTEM_PROMPT, user_prompt)
    recommendations = json.loads(_strip_code_fence(raw))

    return {"recommendations": recommendations}


def _strip_code_fence(text: str) -> str:
    match = re.search(r"```(?:json)?\s*(.*?)\s*```", text, re.DOTALL)
    return match.group(1) if match else text
