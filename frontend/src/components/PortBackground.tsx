// Fixed, full-viewport backdrop: a golden-hour container-terminal photo
// (frontend/public/port_terminal_sunset_full.png, 1920x1080), covering the
// whole screen with a dark gradient overlay on top so foreground text stays
// legible. Sits behind everything (aria-hidden, no pointer events, negative
// z-index).
export function PortBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/port_terminal_sunset_full.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,11,22,0.88) 0%, rgba(5,11,22,0.45) 22%, rgba(5,11,22,0.15) 45%, rgba(5,11,22,0.35) 75%, rgba(5,11,22,0.85) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(5,11,22,0.6) 0%, rgba(5,11,22,0) 15%, rgba(5,11,22,0) 85%, rgba(5,11,22,0.6) 100%)",
        }}
      />
    </div>
  );
}
