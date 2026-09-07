import Link from "next/link";
import { ArrowRight, Radio, RadioTower } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { LiveVesselQueue } from "@/lib/types";

export function PortCard({ port }: { port: LiveVesselQueue }) {
  const hasSignal = port.live_coverage && !port.warming_up;

  return (
    <Link href={`/port/${port.port_id}`} className="group block">
      <Card className="transition-shadow group-hover:shadow-raised">
        <CardBody className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[15px] font-semibold text-ink">{port.port_name}</div>
              <div className="text-xs text-ink-faint">{port.country}</div>
            </div>
            {port.live_coverage ? (
              <Badge tone={hasSignal ? "success" : "neutral"}>
                <Radio className="h-3 w-3" strokeWidth={2} />
                {hasSignal ? "Live" : "Connecting"}
              </Badge>
            ) : (
              <Badge tone="neutral">
                <RadioTower className="h-3 w-3" strokeWidth={2} />
                No live data
              </Badge>
            )}
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-semibold tabular-nums text-ink">
                {port.vessel_queue_length}
              </div>
              <div className="text-xs text-ink-faint">ships waiting right now</div>
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
              See recommendations
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
