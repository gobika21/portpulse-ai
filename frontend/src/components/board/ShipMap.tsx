"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocale } from "@/components/LocaleProvider";
import type { LiveVesselQueue } from "@/lib/types";

interface ShipMapProps {
  live: LiveVesselQueue;
}

const WAITING_COLOR = "#B5540A"; // tier.high — anchored, waiting for a berth
const MOVING_COLOR = "#1D4E89"; // accent — under way
const BERTHED_COLOR = "#4ADE80"; // tier.low — moored at berth

export function ShipMap({ live }: ShipMapProps) {
  const { t } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  // Create the map once per port. Managed imperatively (rather than via
  // react-leaflet's <MapContainer>) because that component's declarative
  // lifecycle conflicts with React 18 Strict Mode's double-invoked effects
  // in development, throwing "Map container is already initialized."
  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView(live.center, 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;
    markersRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live.port_id]);

  // Redraw ship markers whenever the live data refreshes, without rebuilding the map.
  useEffect(() => {
    const layer = markersRef.current;
    if (!layer) return;

    layer.clearLayers();
    for (const ship of live.ships ?? []) {
      const color = ship.at_berth ? BERTHED_COLOR : ship.waiting ? WAITING_COLOR : MOVING_COLOR;
      const label = ship.at_berth ? t("atBerth") : ship.waiting ? t("waiting") : `${t("moving")}, ${ship.speed_knots} kn`;
      L.circleMarker([ship.lat, ship.lon], {
        radius: 5,
        color,
        fillColor: color,
        fillOpacity: 0.75,
        weight: 1.5,
      })
        .bindTooltip(label)
        .addTo(layer);
    }
  }, [live.ships, t]);

  return (
    <div>
      <div ref={containerRef} dir="ltr" style={{ height: 260, width: "100%" }} />
      <div className="flex flex-wrap items-center gap-4 border-t border-border bg-sunken px-4 py-2 text-xs text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: BERTHED_COLOR }} />
          {t("atBerth")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: WAITING_COLOR }} />
          {t("waiting")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: MOVING_COLOR }} />
          {t("moving")}
        </span>
        <span className="ms-auto">
          {(live.ships ?? []).length} {t("shipsShown")}
        </span>
      </div>
    </div>
  );
}
