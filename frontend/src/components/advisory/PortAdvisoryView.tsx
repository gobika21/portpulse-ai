"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { MetricTile } from "@/components/ui/MetricTile";
import { NumberField } from "@/components/ui/NumberField";
import { Skeleton } from "@/components/ui/Skeleton";
import { TierBadge } from "@/components/ui/TierBadge";
import { LiveSignalPanel } from "@/components/board/LiveSignalPanel";
import { AdvisoryCard } from "./AdvisoryCard";
import { api, ApiError } from "@/lib/api";
import { useLiveVesselQueue } from "@/lib/hooks";
import type { AdvisoryResult } from "@/lib/types";

export function PortAdvisoryView({ portId }: { portId: string }) {
  const { data: live, loading: liveLoading, error: liveError } = useLiveVesselQueue(portId);

  const [berthOccupancy, setBerthOccupancy] = useState(0.6);
  const [avgWaitHours, setAvgWaitHours] = useState(8);
  const [result, setResult] = useState<AdvisoryResult | null>(null);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);

  const vesselQueueLength = live?.vessel_queue_length ?? 0;

  // Manual estimates only need a sane starting point once live data first arrives.
  useEffect(() => {
    if (live && live.vessels_observed > 0) {
      setBerthOccupancy((prev) => (prev === 0.6 ? Math.min(0.95, 0.3 + vesselQueueLength * 0.04) : prev));
      setAvgWaitHours((prev) => (prev === 8 ? Math.min(48, vesselQueueLength * 1.2) : prev));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live?.vessels_observed]);

  async function runAdvisory() {
    if (!live) return;
    setRunning(true);
    setRunError(null);
    setResult(null);
    try {
      const advisory = await api.runAdvisory({
        port_name: live.port_name,
        berth_occupancy_rate: berthOccupancy,
        vessel_queue_length: vesselQueueLength,
        avg_waiting_time_hours: avgWaitHours,
      });
      setResult(advisory);
    } catch (e) {
      setRunError(e instanceof ApiError ? e.message : "Failed to run the advisory pipeline");
    } finally {
      setRunning(false);
    }
  }

  if (liveLoading && !live) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Skeleton className="h-48 lg:col-span-1" />
        <Skeleton className="h-48 lg:col-span-2" />
      </div>
    );
  }

  if (liveError && !live) {
    return <ErrorBanner message={liveError} />;
  }

  if (!live) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <LiveSignalPanel live={live} />

        <Card className="lg:col-span-2">
          <CardBody className="flex flex-col gap-4">
            <div className="text-sm font-medium text-ink">Estimated port conditions</div>
            <p className="text-xs leading-relaxed text-ink-faint">
              Berth occupancy and average waiting time aren&rsquo;t published by port authorities, so these are
              manual estimates you can adjust. Vessel queue length is pulled from the live panel.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <NumberField
                label="Berth occupancy"
                value={berthOccupancy}
                onChange={setBerthOccupancy}
                step={0.05}
                min={0}
                max={1}
              />
              <NumberField label="Vessel queue" value={vesselQueueLength} disabled hint="From live AIS feed" />
              <NumberField
                label="Avg waiting time"
                value={avgWaitHours}
                onChange={setAvgWaitHours}
                step={0.5}
                min={0}
                suffix="hrs"
              />
            </div>
            <div>
              <Button onClick={runAdvisory} loading={running}>
                <Sparkles className="h-3.5 w-3.5" />
                Run advisory pipeline
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {runError && <ErrorBanner message={runError} />}

      {result && (
        <div className="flex flex-col gap-6">
          <Card>
            <CardBody className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <TierBadge tier={result.tier} />
                <p className="text-sm text-ink-muted">{result.tier_reasoning}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <MetricTile label="Berth occupancy" value={`${Math.round(berthOccupancy * 100)}%`} />
                <MetricTile label="Vessel queue" value={vesselQueueLength} />
                <MetricTile label="Avg wait" value={`${avgWaitHours}h`} />
              </div>
            </CardBody>
          </Card>

          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Stakeholder advisories
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {result.recommendations.map((rec) => (
                <AdvisoryCard key={rec.persona} recommendation={rec} message={result.advisories[rec.persona]} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
