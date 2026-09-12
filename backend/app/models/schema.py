"""State schema shared across the LangGraph agent pipeline."""

from typing import Literal, NotRequired, TypedDict

CongestionTier = Literal["Low", "Medium", "High", "Critical"]

Persona = Literal["carrier", "trucking_company", "terminal_operator"]

Language = Literal["en", "ar"]


class PortSnapshot(TypedDict):
    port_name: str
    berth_occupancy_rate: float  # 0-1
    vessel_queue_length: int  # number of vessels waiting
    avg_waiting_time_hours: float
    language: NotRequired[Language]


class Recommendation(TypedDict):
    persona: Persona
    action: str
    reasoning: str


class Precedent(TypedDict):
    id: str
    port_name: str
    tier: str
    summary: str
    outcome: str


class AdvisoryState(TypedDict, total=False):
    snapshot: PortSnapshot
    language: Language
    tier: CongestionTier
    tier_reasoning: str
    driving_metrics: list[str]
    precedents: list[Precedent]
    recommendations: list[Recommendation]
    advisories: dict[Persona, str]
