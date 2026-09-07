import { TierBadge } from "@/components/ui/TierBadge";
import type { CongestionTier } from "@/lib/types";

const LEGEND: { tier: CongestionTier; description: string }[] = [
  { tier: "Low", description: "moving smoothly" },
  { tier: "Medium", description: "starting to slow down" },
  { tier: "High", description: "real delays" },
  { tier: "Critical", description: "major delays" },
];

export function TierLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted">
      {LEGEND.map(({ tier, description }) => (
        <div key={tier} className="flex items-center gap-2">
          <TierBadge tier={tier} />
          <span>{description}</span>
        </div>
      ))}
    </div>
  );
}
