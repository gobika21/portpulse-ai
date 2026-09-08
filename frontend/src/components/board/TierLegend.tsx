"use client";

import { Card, CardBody } from "@/components/ui/Card";
import { TierBadge } from "@/components/ui/TierBadge";
import { useLocale } from "@/components/LocaleProvider";
import type { CongestionTier } from "@/lib/types";
import type { TRANSLATIONS } from "@/lib/i18n";

const LEGEND: { tier: CongestionTier; descriptionKey: keyof typeof TRANSLATIONS["en"] }[] = [
  { tier: "Low", descriptionKey: "tierLowDesc" },
  { tier: "Medium", descriptionKey: "tierMediumDesc" },
  { tier: "High", descriptionKey: "tierHighDesc" },
  { tier: "Critical", descriptionKey: "tierCriticalDesc" },
];

export function TierLegend() {
  const { t } = useLocale();

  return (
    <Card>
      <CardBody className="flex flex-wrap items-center gap-x-5 gap-y-2 py-3 text-sm text-ink-muted">
        {LEGEND.map(({ tier, descriptionKey }) => (
          <div key={tier} className="flex items-center gap-2">
            <TierBadge tier={tier} />
            <span>{t(descriptionKey)}</span>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
