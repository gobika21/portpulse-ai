"use client";

import { Ship, Truck, Warehouse, type LucideIcon } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
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
        <p className="border-t border-border pt-3 text-xs leading-relaxed text-ink-faint">
          <span className="font-medium text-ink-muted">{t("why")}</span>
          {recommendation.reasoning}
        </p>
      </CardBody>
    </Card>
  );
}
