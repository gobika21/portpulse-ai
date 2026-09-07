import type { CongestionTier, Persona } from "./types";

export const TIER_STYLES: Record<CongestionTier, { text: string; bg: string; label: string }> = {
  Low: { text: "text-tier-low", bg: "bg-tier-lowSoft", label: "Low" },
  Medium: { text: "text-tier-medium", bg: "bg-tier-mediumSoft", label: "Medium" },
  High: { text: "text-tier-high", bg: "bg-tier-highSoft", label: "High" },
  Critical: { text: "text-tier-critical", bg: "bg-tier-criticalSoft", label: "Critical" },
};

export const PERSONA_LABELS: Record<Persona, string> = {
  carrier: "Carrier",
  trucking_company: "Trucking Company",
  terminal_operator: "Terminal Operator",
};
