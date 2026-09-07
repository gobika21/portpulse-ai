"use client";

import { Sailboat } from "lucide-react";
import { PortCard } from "./PortCard";
import { PortCardSkeleton } from "./PortCardSkeleton";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useLiveVesselQueues } from "@/lib/hooks";

export function PortBoard() {
  const { data: ports, loading, error } = useLiveVesselQueues();

  if (error && !ports) {
    return <ErrorBanner message={error} />;
  }

  if (loading && !ports) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <PortCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!ports || ports.length === 0) {
    return (
      <EmptyState
        icon={Sailboat}
        title="No ports available"
        description="The backend didn't return any tracked ports."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ports.map((port) => (
        <PortCard key={port.port_id} port={port} />
      ))}
    </div>
  );
}
