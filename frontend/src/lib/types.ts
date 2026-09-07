export type CongestionTier = "Low" | "Medium" | "High" | "Critical";

export type Persona = "carrier" | "trucking_company" | "terminal_operator";

export interface PortSummary {
  port_id: string;
  name: string;
  country: string;
  live_coverage: boolean;
}

export interface Ship {
  id: string;
  lat: number;
  lon: number;
  speed_knots: number;
  waiting: boolean;
}

export interface LiveVesselQueue {
  port_id: string;
  port_name: string;
  country: string;
  live_coverage: boolean;
  vessel_queue_length: number;
  vessels_observed: number;
  source: string;
  bounding_box: [[number, number], [number, number]];
  center: [number, number];
  coverage_note: string;
  connected: boolean;
  warming_up: boolean;
  last_error: string | null;
  ships?: Ship[];
}

export interface PortSnapshot {
  port_name: string;
  berth_occupancy_rate: number;
  vessel_queue_length: number;
  avg_waiting_time_hours: number;
}

export interface Recommendation {
  persona: Persona;
  action: string;
  reasoning: string;
}

export interface AdvisoryResult {
  tier: CongestionTier;
  tier_reasoning: string;
  recommendations: Recommendation[];
  advisories: Record<Persona, string>;
}
