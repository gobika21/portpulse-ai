"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { api, ApiError } from "./api";
import type { LiveVesselQueue } from "./types";

const POLL_INTERVAL_MS = 20_000;

interface LiveQueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useLiveVesselQueues() {
  const { locale, t } = useLocale();
  const [state, setState] = useState<LiveQueryState<LiveVesselQueue[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    try {
      const data = await api.liveVesselQueueAll(locale);
      setState({ data, loading: false, error: null });
    } catch (e) {
      setState((prev) => ({
        data: prev.data,
        loading: false,
        error: e instanceof ApiError ? e.message : t("failedToLoad"),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  return { ...state, refresh };
}

export function useLiveVesselQueue(portId: string, withPositions = false) {
  const { locale, t } = useLocale();
  const [state, setState] = useState<LiveQueryState<LiveVesselQueue>>({
    data: null,
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    try {
      const data = await api.liveVesselQueue(portId, withPositions, locale);
      setState({ data, loading: false, error: null });
    } catch (e) {
      setState((prev) => ({
        data: prev.data,
        loading: false,
        error: e instanceof ApiError ? e.message : t("failedToLoad"),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portId, withPositions, locale]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  return { ...state, refresh };
}
