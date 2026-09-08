import type { CongestionTier, Persona } from "./types";
import type { TRANSLATIONS } from "./i18n";

type TranslationKey = keyof typeof TRANSLATIONS["en"];

export const TIER_STYLES: Record<
  CongestionTier,
  { text: string; bg: string; border: string; labelKey: TranslationKey }
> = {
  Low: { text: "text-tier-low", bg: "bg-tier-lowSoft", border: "border-tier-low", labelKey: "tierLow" },
  Medium: {
    text: "text-tier-medium",
    bg: "bg-tier-mediumSoft",
    border: "border-tier-medium",
    labelKey: "tierMedium",
  },
  High: { text: "text-tier-high", bg: "bg-tier-highSoft", border: "border-tier-high", labelKey: "tierHigh" },
  Critical: {
    text: "text-tier-critical",
    bg: "bg-tier-criticalSoft",
    border: "border-tier-critical",
    labelKey: "tierCritical",
  },
};

export const PERSONA_LABEL_KEYS: Record<Persona, TranslationKey> = {
  carrier: "personaCarrier",
  trucking_company: "personaTrucking",
  terminal_operator: "personaTerminal",
};

export const PERSONA_SUBTITLE_KEYS: Record<Persona, TranslationKey> = {
  carrier: "personaCarrierSub",
  trucking_company: "personaTruckingSub",
  terminal_operator: "personaTerminalSub",
};
