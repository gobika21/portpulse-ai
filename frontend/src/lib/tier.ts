import type { CongestionTier, Persona } from "./types";

export const TIER_STYLES: Record<CongestionTier, { text: string; bg: string; label: string }> = {
  Low: { text: "text-tier-low", bg: "bg-tier-lowSoft", label: "Low" },
  Medium: { text: "text-tier-medium", bg: "bg-tier-mediumSoft", label: "Medium" },
  High: { text: "text-tier-high", bg: "bg-tier-highSoft", label: "High" },
  Critical: { text: "text-tier-critical", bg: "bg-tier-criticalSoft", label: "Critical" },
};

export const PERSONA_LABELS: Record<Persona, string> = {
  carrier: "Shipping Company",
  trucking_company: "Trucking Company",
  terminal_operator: "Port Operator",
};

export const PERSONA_SUBTITLES: Record<Persona, string> = {
  carrier: "Owns or runs the ships",
  trucking_company: "Picks up containers by truck",
  terminal_operator: "Runs the port itself",
};
