export function BlockchainBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-40" />

      {/* Floating node dots */}
      {[
        { top: "12%", left: "8%", delay: "0s", size: "h-2 w-2" },
        { top: "28%", left: "85%", delay: "1s", size: "h-1.5 w-1.5" },
        { top: "65%", left: "12%", delay: "0.5s", size: "h-1.5 w-1.5" },
        { top: "78%", left: "90%", delay: "1.5s", size: "h-2 w-2" },
        { top: "45%", left: "95%", delay: "2s", size: "h-1 w-1" },
        { top: "88%", left: "45%", delay: "0.8s", size: "h-1.5 w-1.5" },
      ].map((dot, i) => (
        <div
          key={i}
          className={`absolute ${dot.size} rounded-full bg-primary/20 animate-float`}
          style={{
            top: dot.top,
            left: dot.left,
            animationDelay: dot.delay,
            animationDuration: `${3 + i * 0.5}s`,
          }}
        />
      ))}

      {/* Connecting lines (chain links) */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <line x1="8%" y1="12%" x2="85%" y2="28%" stroke="hsl(35 95% 56%)" strokeWidth="1" strokeDasharray="8 8">
          <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="2s" repeatCount="indefinite" />
        </line>
        <line x1="12%" y1="65%" x2="90%" y2="78%" stroke="hsl(268 76% 65%)" strokeWidth="1" strokeDasharray="8 8">
          <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="2.5s" repeatCount="indefinite" />
        </line>
        <line x1="85%" y1="28%" x2="95%" y2="45%" stroke="hsl(35 95% 56%)" strokeWidth="1" strokeDasharray="6 6">
          <animate attributeName="stroke-dashoffset" from="0" to="-12" dur="1.8s" repeatCount="indefinite" />
        </line>
      </svg>

      {/* Radial gradients */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/[0.04] blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/[0.04] blur-3xl" />
    </div>
  );
}
