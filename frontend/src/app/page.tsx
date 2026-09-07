import { Container } from "@/components/Container";
import { PageHeading } from "@/components/PageHeading";
import { PortBoard } from "@/components/board/PortBoard";

export default function HomePage() {
  return (
    <Container className="flex flex-col gap-8 py-10">
      <PageHeading
        eyebrow="Live congestion board"
        title="Port congestion, tracked in real time"
        description="Vessel positions are pulled live from AIS receivers and used as a proxy for anchorage congestion. Select a port to see its full advisory: tier classification and stakeholder-specific recommendations from a 4-agent reasoning pipeline."
      />
      <PortBoard />
    </Container>
  );
}
