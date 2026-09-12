"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/Container";
import { PageHeading } from "@/components/PageHeading";
import { PortAdvisoryView } from "@/components/advisory/PortAdvisoryView";
import { useLocale } from "@/components/LocaleProvider";

export function PortPageContent({ portId }: { portId: string }) {
  const { t } = useLocale();

  return (
    <Container className="flex flex-col gap-6 py-10">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
        {t("allPorts")}
      </Link>
      <PageHeading
        eyebrow={t("portStatusEyebrow")}
        title={t("portStatusTitle")}
        description={t("portStatusDescription")}
      />
      <PortAdvisoryView portId={portId} />
    </Container>
  );
}
