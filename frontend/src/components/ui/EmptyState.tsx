import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-border px-6 py-10 text-center">
      <Icon className="h-6 w-6 text-ink-faint" strokeWidth={1.5} />
      <div className="text-sm font-medium text-ink">{title}</div>
      {description && <p className="max-w-sm text-sm text-ink-faint">{description}</p>}
    </div>
  );
}
