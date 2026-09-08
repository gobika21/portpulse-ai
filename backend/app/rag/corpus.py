"""Precedent corpus for the RAG historical-precedent agent.

Each entry is an illustrative summary of a well-known port congestion episode,
used to ground the decision-support agent's reasoning in past outcomes rather
than live metrics alone. This is a small hand-written seed corpus — swap it
for a real embeddings index (pgvector/Chroma) over the dissertation's case
studies once that data is available; the retriever interface won't need to
change.
"""

from typing import TypedDict


class Precedent(TypedDict):
    id: str
    port_name: str
    tier: str
    tags: list[str]
    summary: str
    outcome: str


PRECEDENTS: list[Precedent] = [
    {
        "id": "la-long-beach-2021",
        "port_name": "Los Angeles / Long Beach",
        "tier": "Critical",
        "tags": ["queue", "backlog", "container", "peak-season", "labor"],
        "summary": (
            "Late 2021: a record backlog of container ships anchored offshore for "
            "weeks amid a pandemic-driven import surge and inland trucking/warehouse "
            "shortages."
        ),
        "outcome": (
            "Carriers diverted some calls to secondary West Coast ports; terminals "
            "moved to 24/7 operations; trucking companies that pre-booked appointment "
            "slots cleared containers faster than those relying on drop-in pickups."
        ),
    },
    {
        "id": "yantian-2021",
        "port_name": "Yantian",
        "tier": "Critical",
        "tags": ["shutdown", "covid", "berth", "outage"],
        "summary": (
            "Mid-2021: a COVID outbreak forced a partial terminal shutdown, cutting "
            "throughput sharply while inbound vessel volume stayed constant."
        ),
        "outcome": (
            "Vessels were held or diverted to nearby ports; carriers that rebooked "
            "early to alternate terminals avoided the worst of the multi-week delay; "
            "shippers absorbed higher detention and demurrage costs."
        ),
    },
    {
        "id": "suez-2021",
        "port_name": "Suez Canal transit ports",
        "tier": "High",
        "tags": ["blockage", "transit", "schedule", "queue"],
        "summary": (
            "March 2021: a six-day canal blockage created a queue of several hundred "
            "vessels and knocked on to congestion at ports along the affected trade "
            "lanes for weeks afterward."
        ),
        "outcome": (
            "Terminal operators prioritized berthing by original ETA rather than "
            "arrival order to reduce fairness disputes; carriers that gave customers "
            "early ETA revisions saw fewer missed inland connections."
        ),
    },
    {
        "id": "rotterdam-2022",
        "port_name": "Rotterdam",
        "tier": "Medium",
        "tags": ["winter", "weather", "inland", "barge"],
        "summary": (
            "Winter 2022: low Rhine water levels slowed barge transfers, causing "
            "moderate buildup of containers waiting for inland onward transport "
            "rather than a berth-side bottleneck."
        ),
        "outcome": (
            "Terminal operators expanded temporary container yard capacity; trucking "
            "companies picked up more of the inland leg to compensate for reduced "
            "barge throughput."
        ),
    },
    {
        "id": "shanghai-2022",
        "port_name": "Shanghai",
        "tier": "Critical",
        "tags": ["lockdown", "labor", "trucking", "closure"],
        "summary": (
            "Spring 2022: a citywide lockdown sharply cut available trucking labor "
            "even though the terminal itself kept operating, creating a landside "
            "bottleneck rather than a berth one."
        ),
        "outcome": (
            "Carriers extended free-time windows to reduce shipper penalties; "
            "trucking companies that secured lockdown-exempt driver permits early "
            "kept moving cargo while others stalled."
        ),
    },
    {
        "id": "felixstowe-2022",
        "port_name": "Felixstowe",
        "tier": "High",
        "tags": ["strike", "labor", "trucking"],
        "summary": (
            "Summer 2022: dockworker strikes over pay repeatedly halted operations "
            "for several days at a time, each stoppage adding to a queue that never "
            "fully cleared between actions."
        ),
        "outcome": (
            "Some carriers rerouted calls to Felixstowe's alternates for the strike "
            "windows; terminal operators communicated strike dates early enough for "
            "trucking companies to reschedule pickups rather than arrive to a closed gate."
        ),
    },
]
