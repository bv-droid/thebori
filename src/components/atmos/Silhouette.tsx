/* Hidden figure — back view, hooded, no face (spec §8.3).
   Atmospheric placeholder for the generated hero plate; reads as a
   person standing in mist. Soft, blurred, rim-lit from behind. */

export function Silhouette({ className }: { className?: string }) {
  const body =
    "M150 72 C124 72 108 92 106 128 C105 148 102 166 96 182 " +
    "C74 200 60 228 56 288 L62 600 L238 600 L244 288 " +
    "C240 228 226 200 204 182 C198 166 195 148 194 128 " +
    "C192 92 176 72 150 72 Z";

  return (
    <svg
      className={className}
      viewBox="0 0 300 600"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="figFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#26251f" />
          <stop offset="0.55" stopColor="#15140f" />
          <stop offset="1" stopColor="#0c0c0a" />
        </linearGradient>
        <linearGradient id="figRim" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="rgba(168,176,184,0.55)" />
          <stop offset="0.25" stopColor="rgba(168,176,184,0.05)" />
          <stop offset="1" stopColor="rgba(168,176,184,0)" />
        </linearGradient>
        <filter id="figBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.7" />
        </filter>
        <radialGradient id="figShadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(0,0,0,0.5)" />
          <stop offset="1" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* ground contact shadow */}
      <ellipse cx="150" cy="596" rx="120" ry="20" fill="url(#figShadow)" />

      <g filter="url(#figBlur)">
        <path d={body} fill="url(#figFill)" />
        {/* hood opening — darker recess */}
        <ellipse cx="150" cy="118" rx="26" ry="34" fill="#0a0a08" opacity="0.7" />
        {/* back seam */}
        <path
          d="M150 168 L150 588"
          stroke="rgba(168,176,184,0.10)"
          strokeWidth="1.4"
          fill="none"
        />
        <path d={body} fill="none" stroke="url(#figRim)" strokeWidth="2.4" />
      </g>
    </svg>
  );
}
