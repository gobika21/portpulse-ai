"use client";

import { cn } from "@/lib/cn";
import { TIER_STYLES } from "@/lib/tier";
import { useLocale } from "@/components/LocaleProvider";
import type { CongestionTier } from "@/lib/types";

export function TierBadge({ tier, className }: { tier: CongestionTier; className?: string }) {
  const { t } = useLocale();
  const style = TIER_STYLES[tier];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-1 text-sm font-semibold",
        style.bg,
        style.text,
        className,
      )}
    >
      {t(style.labelKey)}
    </span>
  );
}
