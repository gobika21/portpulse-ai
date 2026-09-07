import { AlertTriangle } from "lucide-react";

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-sm border border-tier-critical/25 bg-tier-criticalSoft px-4 py-3 text-sm text-tier-critical">
      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={1.75} />
      <span>{message}</span>
    </div>
  );
}
