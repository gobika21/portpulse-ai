"""Run the agent pipeline end-to-end from the command line.

Usage:
    python cli.py low|medium|high|critical
"""

import json
import sys

from dotenv import load_dotenv

load_dotenv()

from app.graph import run_pipeline
from app.scenarios import SCENARIOS


def main():
    scenario_key = sys.argv[1] if len(sys.argv) > 1 else "high"
    if scenario_key not in SCENARIOS:
        print(f"Unknown scenario '{scenario_key}'. Choose from: {list(SCENARIOS)}")
        sys.exit(1)

    snapshot = SCENARIOS[scenario_key]
    result = run_pipeline(snapshot)

    print(f"\n=== Tier: {result['tier']} ===")
    print(result["tier_reasoning"])
    print("\n=== Recommendations ===")
    print(json.dumps(result["recommendations"], indent=2))
    print("\n=== Advisories ===")
    for persona, message in result["advisories"].items():
        print(f"\n-- {persona} --")
        print(message)


if __name__ == "__main__":
    main()
