"use client";

import Link from "next/link";
import { Anchor, Languages } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import { LOCALE_LABEL } from "@/lib/i18n";

export function Header() {
  const { locale, toggleLocale, t } = useLocale();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-page items-center gap-2.5 px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Anchor className="h-4 w-4 text-accent" strokeWidth={2} />
          <span className="text-[15px] font-semibold tracking-tight text-ink">{t("appName")}</span>
        </Link>
        <span className="rounded-sm bg-sunken px-2 py-0.5 text-xs font-medium text-ink-muted">
          {t("tagline")}
        </span>
        <button
          type="button"
          onClick={toggleLocale}
          className="ms-auto flex items-center gap-1.5 rounded-sm border border-border px-2 py-1 text-xs font-medium text-ink-muted transition-colors hover:bg-sunken hover:text-ink"
          aria-label={t("toggleLanguage")}
        >
          <Languages className="h-3.5 w-3.5" strokeWidth={2} />
          {LOCALE_LABEL[locale]}
        </button>
      </div>
    </header>
  );
}
