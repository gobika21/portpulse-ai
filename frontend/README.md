# PortPulse — Web

Next.js (App Router, TypeScript, Tailwind) dashboard for the PortPulse congestion advisory pipeline.

## Structure

```
src/
  app/                      routes (App Router)
    page.tsx                port board (home)
    port/[portId]/page.tsx  single port: live signal + advisory pipeline
  components/
    ui/                     generic primitives — Button, Card, Badge, TierBadge,
                             MetricTile, NumberField, EmptyState, Skeleton, ErrorBanner
    board/                  port board — PortCard, PortBoard, LiveSignalPanel
    advisory/               advisory pipeline UI — PortAdvisoryView, AdvisoryCard
  lib/
    api.ts                  typed fetch client for the backend
    types.ts                shared types (mirrors the backend Pydantic models)
    tier.ts                 tier/persona display mappings
    hooks.ts                live-data polling hooks
```

## Setup

```bash
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_PORTPULSE_API_URL if not using the default
npm run dev
```

Open http://localhost:3000. Requires the [backend](../backend) running.
