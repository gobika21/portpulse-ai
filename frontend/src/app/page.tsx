"use client";

import { Container } from "@/components/Container";
import { PageHeading } from "@/components/PageHeading";
import { PortBoard } from "@/components/board/PortBoard";
import { useLocale } from "@/components/LocaleProvider";

export default function HomePage() {
  const { t } = useLocale();

  return (
    <Container className="flex flex-col gap-8 py-10">
      <PageHeading eyebrow={t("homeEyebrow")} title={t("homeTitle")} description={t("homeDescription")} />
      <PortBoard />
    </Container>
  );
}
