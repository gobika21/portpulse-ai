import { Container } from "@/components/Container";
import { PageHeading } from "@/components/PageHeading";
import { PortBoard } from "@/components/board/PortBoard";

export default function HomePage() {
  return (
    <Container className="flex flex-col gap-8 py-10">
      <PageHeading
        eyebrow="Live port traffic"
        title="Which ports are backed up right now?"
        description="We track real ships near five major ports to see how many are stuck waiting. Pick a port below to see how bad it is, and get plain-English advice for shipping companies, trucking companies, and the port itself."
      />
      <PortBoard />
    </Container>
  );
}
