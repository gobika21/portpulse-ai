"""Decision-support agent: Claude reasoning node producing per-persona recommendations."""

import json
import re

from app.claude_client import ask_claude
from app.models.schema import AdvisoryState

SYSTEM_PROMPT = """You are a port operations decision-support analyst. Given a congestion \
snapshot, its tier, and the reasoning behind that tier, produce concrete recommendations \
for three stakeholders: a carrier, a trucking company, and a terminal operator.

Cite the specific metric(s) that triggered each recommendation. Do not give a flat \
"safe/unsafe" verdict — explain the reasoning.

Respond ONLY with valid JSON, an array of exactly 3 objects, each shaped as:
{"persona": "carrier" | "trucking_company" | "terminal_operator", "action": "...", "reasoning": "..."}
"""


def decision_support_node(state: AdvisoryState) -> AdvisoryState:
    snapshot = state["snapshot"]
    tier = state["tier"]
    tier_reasoning = state["tier_reasoning"]

    user_prompt = (
        f"Port: {snapshot['port_name']}\n"
        f"Congestion tier: {tier}\n"
        f"Tier reasoning: {tier_reasoning}\n"
        f"Berth occupancy rate: {snapshot['berth_occupancy_rate']}\n"
        f"Vessel queue length: {snapshot['vessel_queue_length']}\n"
        f"Average waiting time (hours): {snapshot['avg_waiting_time_hours']}\n"
    )

    raw = ask_claude(SYSTEM_PROMPT, user_prompt)
    recommendations = json.loads(_strip_code_fence(raw))

    return {"recommendations": recommendations}


def _strip_code_fence(text: str) -> str:
    match = re.search(r"```(?:json)?\s*(.*?)\s*```", text, re.DOTALL)
    return match.group(1) if match else text
