// Fixed, decorative backdrop: an aerial-marina illustration — a sunlit
// turquoise harbor basin with piers radiating out and small boats docked
// along each one, echoing the reference photo — fading into the app's dark
// canvas so foreground text always stays legible. Sits behind everything
// (aria-hidden, no pointer events, negative z-index).

function Pier({ boatCount = 7 }: { boatCount?: number }) {
  const boats = Array.from({ length: boatCount });
  return (
    <g>
      <rect x="-4" y="-72" width="8" height="72" fill="#D8C79E" />
      {boats.map((_, i) => {
        const y = -10 - i * 10.5;
        return (
          <g key={i}>
            <rect x="-18" y={y - 2.5} width="12" height="5" rx="2" fill="#F4F1E8" />
            <rect x="6" y={y - 2.5} width="12" height="5" rx="2" fill="#F4F1E8" />
          </g>
        );
      })}
    </g>
  );
}

export function PortBackground() {
  const piers = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas" aria-hidden="true">
      {/* base canvas so the illustration always fades to the app's dark background */}
      <div className="absolute inset-0 bg-canvas" />

      <svg
        className="absolute left-1/2 top-[85%] -translate-x-1/2 -translate-y-1/2 opacity-90"
        width="1200"
        height="1200"
        viewBox="0 0 1200 1200"
      >
        <defs>
          <radialGradient id="water" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2FD4C9" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#1596A9" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0B3A52" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="fadeOut" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#050B16" stopOpacity="0" />
            <stop offset="70%" stopColor="#050B16" stopOpacity="0" />
            <stop offset="100%" stopColor="#050B16" stopOpacity="1" />
          </radialGradient>
        </defs>

        <circle cx="600" cy="600" r="420" fill="url(#water)" />

        <g>
          <circle cx="600" cy="600" r="36" fill="#D8C79E" />
          {piers.map((angle) => (
            <g key={angle} transform={`translate(600 600) rotate(${angle})`}>
              <Pier />
            </g>
          ))}
        </g>

        {/* coastline haze at the basin's edge */}
        <circle cx="600" cy="600" r="440" fill="none" stroke="#0E4A57" strokeOpacity="0.4" strokeWidth="70" />

        {/* fade the whole scene into the canvas color toward the viewport edges */}
        <rect x="0" y="0" width="1200" height="1200" fill="url(#fadeOut)" />
      </svg>
    </div>
  );
}
