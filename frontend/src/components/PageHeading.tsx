interface PageHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageHeading({ eyebrow, title, description }: PageHeadingProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-wide text-accent">{eyebrow}</span>
      )}
      <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
      {description && <p className="max-w-2xl text-sm text-ink-muted">{description}</p>}
    </div>
  );
}
