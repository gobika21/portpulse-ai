import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/Container";
import { PageHeading } from "@/components/PageHeading";
import { PortAdvisoryView } from "@/components/advisory/PortAdvisoryView";
import { TierLegend } from "@/components/board/TierLegend";

export default async function PortPage({ params }: { params: Promise<{ portId: string }> }) {
  const { portId } = await params;

  return (
    <Container className="flex flex-col gap-6 py-10">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All ports
      </Link>
      <PageHeading
        eyebrow="Port status"
        title="How congested is this port?"
        description="We look at how many ships are waiting, check how serious it is, and write specific advice for the people who deal with this every day."
      />
      <TierLegend />
      <PortAdvisoryView portId={portId} />
    </Container>
  );
}
