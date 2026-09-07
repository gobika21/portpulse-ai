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
import { LoadingSteps } from "./LoadingSteps";
import { api, ApiError } from "@/lib/api";
import { useLiveVesselQueue } from "@/lib/hooks";
import type { AdvisoryResult, PortSnapshot } from "@/lib/types";

export function PortAdvisoryView({ portId }: { portId: string }) {
  const { data: live, loading: liveLoading, error: liveError } = useLiveVesselQueue(portId);

  const DEFAULT_FULL_PERCENT = 60;
  const DEFAULT_DELAY_HOURS = 8;

  // "How full" is edited as a whole percent (0-100) — much clearer for a general
  // audience than a raw 0-1 fraction — and only converted to a fraction at submit time.
  const [fullPercent, setFullPercent] = useState(DEFAULT_FULL_PERCENT);
  const [avgWaitHours, setAvgWaitHours] = useState(DEFAULT_DELAY_HOURS);
  const [result, setResult] = useState<AdvisoryResult | null>(null);
  // The exact numbers sent to the backend for `result` — kept separate from the live
  // inputs above so the results below can't silently drift out of sync with the live
  // feed polling in the background after the request was made.
  const [submittedSnapshot, setSubmittedSnapshot] = useState<PortSnapshot | null>(null);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);

  const vesselQueueLength = live?.vessel_queue_length ?? 0;

  // Manual estimates only need a sane starting point once live data first arrives.
  useEffect(() => {
    if (live && live.vessels_observed > 0) {
      setFullPercent((prev) => (prev === DEFAULT_FULL_PERCENT ? Math.round(Math.min(95, 30 + vesselQueueLength * 4)) : prev));
      setAvgWaitHours((prev) =>
        prev === DEFAULT_DELAY_HOURS ? Math.round(Math.min(48, vesselQueueLength * 1.2) * 2) / 2 : prev,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live?.vessels_observed]);

  async function runAdvisory() {
    if (!live) return;
    const snapshot: PortSnapshot = {
      port_name: live.port_name,
      berth_occupancy_rate: fullPercent / 100,
      vessel_queue_length: vesselQueueLength,
      avg_waiting_time_hours: avgWaitHours,
    };
    setRunning(true);
    setRunError(null);
    setResult(null);
    try {
      const advisory = await api.runAdvisory(snapshot);
      setResult(advisory);
      setSubmittedSnapshot(snapshot);
    } catch (e) {
      setRunError(e instanceof ApiError ? e.message : "Something went wrong while getting recommendations.");
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
      <h2 className="text-lg font-semibold text-ink">{live.port_name}</h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <LiveSignalPanel live={live} />

        <Card className="lg:col-span-2">
          <CardBody className="flex flex-col gap-4">
            <div className="text-sm font-medium text-ink">Fill in what you know</div>
            <p className="text-xs leading-relaxed text-ink-faint">
              Ports don&rsquo;t publish how full their berths are or how long ships actually wait, so those two
              numbers are your best estimate — adjust them if you know better. The number of ships waiting comes
              straight from live tracking.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <NumberField
                label="How full the port is"
                value={fullPercent}
                onChange={(v) => setFullPercent(Math.round(v))}
                step={5}
                min={0}
                max={100}
                suffix="%"
              />
              <NumberField label="Ships waiting" value={vesselQueueLength} disabled hint="From live tracking" />
              <NumberField
                label="Average delay"
                value={avgWaitHours}
                onChange={(v) => setAvgWaitHours(Math.round(v * 2) / 2)}
                step={0.5}
                min={0}
                suffix="hrs"
              />
            </div>
            <div>
              <Button onClick={runAdvisory} loading={running}>
                <Sparkles className="h-3.5 w-3.5" />
                Get recommendations
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {running && (
        <Card>
          <CardBody>
            <LoadingSteps />
          </CardBody>
        </Card>
      )}

      {runError && <ErrorBanner message={runError} />}

      {result && submittedSnapshot && (
        <div className="flex flex-col gap-6">
          <Card>
            <CardBody className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <TierBadge tier={result.tier} />
                <p className="text-sm text-ink-muted">{result.tier_reasoning}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <MetricTile
                  label="How full the port is"
                  value={`${Math.round(submittedSnapshot.berth_occupancy_rate * 100)}%`}
                />
                <MetricTile label="Ships waiting" value={submittedSnapshot.vessel_queue_length} />
                <MetricTile label="Average delay" value={`${submittedSnapshot.avg_waiting_time_hours}h`} />
              </div>
            </CardBody>
          </Card>

          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">
              What each group should do
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
