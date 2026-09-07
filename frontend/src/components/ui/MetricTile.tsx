import type { ReactNode } from "react";

interface MetricTileProps {
  label: string;
  value: ReactNode;
  hint?: string;
}

export function MetricTile({ label, value, hint }: MetricTileProps) {
  return (
    <div className="rounded-sm border border-border bg-sunken px-4 py-3">
      <div className="text-xs font-medium uppercase tracking-wide text-ink-faint">{label}</div>
      <div className="mt-1 text-xl font-semibold text-ink">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-ink-faint">{hint}</div>}
    </div>
  );
}
