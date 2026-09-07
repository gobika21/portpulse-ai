"""State schema shared across the LangGraph agent pipeline."""

from typing import Literal, TypedDict

CongestionTier = Literal["Low", "Medium", "High", "Critical"]

Persona = Literal["carrier", "trucking_company", "terminal_operator"]


class PortSnapshot(TypedDict):
    port_name: str
    berth_occupancy_rate: float  # 0-1
    vessel_queue_length: int  # number of vessels waiting
    avg_waiting_time_hours: float


class Recommendation(TypedDict):
    persona: Persona
    action: str
    reasoning: str


class AdvisoryState(TypedDict, total=False):
    snapshot: PortSnapshot
    tier: CongestionTier
    tier_reasoning: str
    recommendations: list[Recommendation]
    advisories: dict[Persona, str]
