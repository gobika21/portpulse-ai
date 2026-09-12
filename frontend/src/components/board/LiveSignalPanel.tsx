"use client";

import { Radio, RadioTower } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { MetricTile } from "@/components/ui/MetricTile";
import { useLocale } from "@/components/LocaleProvider";
import type { LiveVesselQueue } from "@/lib/types";

export function LiveSignalPanel({ live, children }: { live: LiveVesselQueue; children?: React.ReactNode }) {
  const { t } = useLocale();
  const hasSignal = live.live_coverage && !live.warming_up;

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardBody className="flex flex-1 flex-col gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-ink">
          {live.live_coverage ? (
            <Radio className={hasSignal ? "h-4 w-4 text-tier-low" : "h-4 w-4 text-ink-faint"} strokeWidth={2} />
          ) : (
            <RadioTower className="h-4 w-4 text-ink-faint" strokeWidth={2} />
          )}
          {t("liveShipTracking")}
        </div>
        <p className="text-xs leading-relaxed text-ink-faint">{live.coverage_note}</p>
        <div className="grid grid-cols-3 gap-3">
          <MetricTile label={t("shipsNearby")} value={live.vessels_observed} />
          <MetricTile label={t("shipsWaiting")} value={live.vessel_queue_length} hint={t("usedBelow")} />
          <MetricTile label={t("shipsAtBerth")} value={live.vessels_at_berth} />
        </div>
        {live.warming_up && live.live_coverage && (
          <p className="text-xs text-ink-faint">{t("warmingUp")}</p>
        )}
      </CardBody>
      {children && <div className="border-t border-border">{children}</div>}
    </Card>
  );
}
