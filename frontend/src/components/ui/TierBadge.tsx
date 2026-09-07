import { cn } from "@/lib/cn";
import { TIER_STYLES } from "@/lib/tier";
import type { CongestionTier } from "@/lib/types";

export function TierBadge({ tier, className }: { tier: CongestionTier; className?: string }) {
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
      {style.label}
    </span>
  );
}
