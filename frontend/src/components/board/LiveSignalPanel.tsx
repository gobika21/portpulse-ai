import { Radio, RadioTower } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { MetricTile } from "@/components/ui/MetricTile";
import type { LiveVesselQueue } from "@/lib/types";

export function LiveSignalPanel({ live }: { live: LiveVesselQueue }) {
  const hasSignal = live.live_coverage && !live.warming_up;

  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-ink">
          {live.live_coverage ? (
            <Radio className={hasSignal ? "h-4 w-4 text-tier-low" : "h-4 w-4 text-ink-faint"} strokeWidth={2} />
          ) : (
            <RadioTower className="h-4 w-4 text-ink-faint" strokeWidth={2} />
          )}
          Live AIS signal
        </div>
        <p className="text-xs leading-relaxed text-ink-faint">{live.coverage_note}</p>
        <div className="grid grid-cols-2 gap-3">
          <MetricTile label="Vessels observed" value={live.vessels_observed} />
          <MetricTile label="Anchored / waiting" value={live.vessel_queue_length} />
        </div>
        {live.warming_up && live.live_coverage && (
          <p className="text-xs text-ink-faint">
            Feed just connected — anchored vessels report roughly every 2–3 minutes, so this count fills in shortly.
          </p>
        )}
      </CardBody>
    </Card>
  );
}
