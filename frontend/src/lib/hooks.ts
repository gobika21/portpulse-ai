"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "./api";
import type { LiveVesselQueue } from "./types";

const POLL_INTERVAL_MS = 20_000;

interface LiveQueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useLiveVesselQueues() {
  const [state, setState] = useState<LiveQueryState<LiveVesselQueue[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    try {
      const data = await api.liveVesselQueueAll();
      setState({ data, loading: false, error: null });
    } catch (e) {
      setState((prev) => ({
        data: prev.data,
        loading: false,
        error: e instanceof ApiError ? e.message : "Failed to load live port data",
      }));
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  return { ...state, refresh };
}

export function useLiveVesselQueue(portId: string, withPositions = false) {
  const [state, setState] = useState<LiveQueryState<LiveVesselQueue>>({
    data: null,
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    try {
      const data = await api.liveVesselQueue(portId, withPositions);
      setState({ data, loading: false, error: null });
    } catch (e) {
      setState((prev) => ({
        data: prev.data,
        loading: false,
        error: e instanceof ApiError ? e.message : "Failed to load live port data",
      }));
    }
  }, [portId, withPositions]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  return { ...state, refresh };
}
