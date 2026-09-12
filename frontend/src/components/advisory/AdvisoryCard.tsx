"use client";

import { useState } from "react";
import { ChevronDown, Ship, Truck, Warehouse, type LucideIcon } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { PERSONA_LABEL_KEYS, PERSONA_SUBTITLE_KEYS } from "@/lib/tier";
import { useLocale } from "@/components/LocaleProvider";
import type { Persona, Recommendation } from "@/lib/types";

const PERSONA_ICONS: Record<Persona, LucideIcon> = {
  carrier: Ship,
  trucking_company: Truck,
  terminal_operator: Warehouse,
};

interface AdvisoryCardProps {
  recommendation: Recommendation;
  message: string;
}

export function AdvisoryCard({ recommendation, message }: AdvisoryCardProps) {
  const { t } = useLocale();
  const [showWhy, setShowWhy] = useState(false);
  const Icon = PERSONA_ICONS[recommendation.persona];

  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-accent-soft text-accent-hover">
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight text-ink">
              {t(PERSONA_LABEL_KEYS[recommendation.persona])}
            </div>
            <div className="text-xs text-ink-faint">{t(PERSONA_SUBTITLE_KEYS[recommendation.persona])}</div>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-ink-muted">{message}</p>
        <button
          type="button"
          onClick={() => setShowWhy((v) => !v)}
          aria-expanded={showWhy}
          className="flex items-center gap-1 self-start rounded-sm border-t border-border pt-3 text-xs font-medium text-ink-faint hover:text-ink-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {t("why")}
          <ChevronDown className={cn("h-3 w-3 transition-transform", showWhy && "rotate-180")} />
        </button>
        {showWhy && (
          <p className="text-xs leading-relaxed text-ink-faint">{recommendation.reasoning}</p>
        )}
      </CardBody>
    </Card>
  );
}
