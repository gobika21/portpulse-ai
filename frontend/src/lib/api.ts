import type { AdvisoryResult, LiveVesselQueue, PortSnapshot, PortSummary } from "./types";

const API_URL = process.env.NEXT_PUBLIC_PORTPULSE_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError(`Could not reach the PortPulse backend at ${API_URL}`);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.detail ?? `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  listPorts: () => request<PortSummary[]>("/live/ports"),
  liveVesselQueue: (portId: string, withPositions = false) =>
    request<LiveVesselQueue>(
      `/live/vessel-queue?port=${encodeURIComponent(portId)}${withPositions ? "&positions=true" : ""}`,
    ),
  liveVesselQueueAll: () => request<LiveVesselQueue[]>("/live/vessel-queue/all"),
  runAdvisory: (snapshot: PortSnapshot) =>
    request<AdvisoryResult>("/advisory", { method: "POST", body: JSON.stringify(snapshot) }),
};
