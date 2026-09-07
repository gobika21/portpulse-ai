import Link from "next/link";
import { Anchor } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-page items-center gap-2.5 px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Anchor className="h-4 w-4 text-accent" strokeWidth={2} />
          <span className="text-[15px] font-semibold tracking-tight text-ink">PortPulse</span>
        </Link>
        <span className="rounded-sm bg-sunken px-2 py-0.5 text-xs font-medium text-ink-muted">
          Congestion Advisory
        </span>
      </div>
    </header>
  );
}
