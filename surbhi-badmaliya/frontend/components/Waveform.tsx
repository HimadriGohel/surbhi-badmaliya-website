// Static, decorative sound-wave line (no constant motion). Pure SVG, server-rendered.
export default function Waveform({ className = "", bars = 96 }: { className?: string; bars?: number }) {
  const hs = Array.from({ length: bars }, (_, i) => {
    const v = Math.abs(Math.sin(i * 0.45) * Math.cos(i * 0.13)) * 0.85 + 0.12;
    return Math.round(v * 100) / 100;
  });
  return (
    <svg aria-hidden="true" className={className} viewBox={`0 0 ${bars * 6} 60`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="wf" x1="0" x2="1">
          <stop offset="0" stopColor="#d62828" />
          <stop offset="1" stopColor="#ff8a7a" />
        </linearGradient>
      </defs>
      {hs.map((h, i) => (
        <rect key={i} x={i * 6 + 1} y={30 - h * 28} width="3" height={h * 56} rx="1.5" fill="url(#wf)" />
      ))}
    </svg>
  );
}
