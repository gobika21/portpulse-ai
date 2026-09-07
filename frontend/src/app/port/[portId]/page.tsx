import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/Container";
import { PageHeading } from "@/components/PageHeading";
import { PortAdvisoryView } from "@/components/advisory/PortAdvisoryView";

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
        eyebrow="Congestion advisory"
        title="Vessel queue → tier → stakeholder recommendations"
        description="Monitoring, Classification, Decision-support, and Advisory-drafting agents run in sequence over this port's current signal."
      />
      <PortAdvisoryView portId={portId} />
    </Container>
  );
}
