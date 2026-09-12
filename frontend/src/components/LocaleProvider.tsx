"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LOCALE_DIR, translate, type Locale } from "@/lib/i18n";

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: Parameters<typeof translate>[1]) => string;
} | null>(null);

const STORAGE_KEY = "berthiq-locale";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "ar") setLocaleState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = LOCALE_DIR[locale];
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const setLocale = (next: Locale) => setLocaleState(next);
  const toggleLocale = () => setLocaleState((l) => (l === "en" ? "ar" : "en"));
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggleLocale, t }}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}
