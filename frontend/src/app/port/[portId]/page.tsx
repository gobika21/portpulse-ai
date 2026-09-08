import { PortPageContent } from "@/components/advisory/PortPageContent";

export default async function PortPage({ params }: { params: Promise<{ portId: string }> }) {
  const { portId } = await params;
  return <PortPageContent portId={portId} />;
}
