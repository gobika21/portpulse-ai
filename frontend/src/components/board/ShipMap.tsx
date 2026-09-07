"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LiveVesselQueue } from "@/lib/types";

interface ShipMapProps {
  live: LiveVesselQueue;
}

const WAITING_COLOR = "#B5540A"; // tier.high — a ship sitting still
const MOVING_COLOR = "#1D4E89"; // accent — a ship under way

export function ShipMap({ live }: ShipMapProps) {
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
      const color = ship.waiting ? WAITING_COLOR : MOVING_COLOR;
      L.circleMarker([ship.lat, ship.lon], {
        radius: 5,
        color,
        fillColor: color,
        fillOpacity: 0.75,
        weight: 1.5,
      })
        .bindTooltip(ship.waiting ? "Waiting" : `Moving, ${ship.speed_knots} kn`)
        .addTo(layer);
    }
  }, [live.ships]);

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div ref={containerRef} style={{ height: 320, width: "100%" }} />
      <div className="flex items-center gap-4 border-t border-border bg-sunken px-4 py-2 text-xs text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: WAITING_COLOR }} />
          Waiting
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: MOVING_COLOR }} />
          Moving
        </span>
        <span className="ml-auto">{(live.ships ?? []).length} ships shown</span>
      </div>
    </div>
  );
}
