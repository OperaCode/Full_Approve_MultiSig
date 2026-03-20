import { Shield, FileText, CheckCircle2, Coins } from "lucide-react";

interface StatsCardsProps {
  balance: string;
  totalBudgets: number;
  approvedBudgets: number;
  releasedBudgets: number;
}

export function StatsCards({ balance, totalBudgets, approvedBudgets, releasedBudgets }: StatsCardsProps) {
  const stats = [
    {
      label: "Treasury",
      value: `${parseFloat(balance).toFixed(4)} ETH`,
      icon: <Coins className="h-5 w-5" />,
      accent: "primary" as const,
    },
    {
      label: "Total Budgets",
      value: totalBudgets.toString(),
      icon: <FileText className="h-5 w-5" />,
      accent: "default" as const,
    },
    {
      label: "Fully Approved",
      value: approvedBudgets.toString(),
      icon: <CheckCircle2 className="h-5 w-5" />,
      accent: "default" as const,
    },
    {
      label: "Released",
      value: releasedBudgets.toString(),
      icon: <Shield className="h-5 w-5" />,
      accent: "info" as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`group relative overflow-hidden rounded-xl border p-5 transition-all duration-300 animate-block-stack ${
            stat.accent === "primary"
              ? "border-primary/30 bg-primary/5 glow-primary"
              : stat.accent === "info"
              ? "border-accent/20 bg-accent/5"
              : "border-border bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
          }`}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {/* Chain decoration */}
          <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/[0.04] transition-transform duration-500 group-hover:scale-150" />

          <div className={`mb-3 ${
            stat.accent === "primary" ? "text-primary" :
            stat.accent === "info" ? "text-accent" :
            "text-muted-foreground"
          }`}>
            {stat.icon}
          </div>
          <p className="font-mono text-2xl font-semibold tabular-nums text-foreground">
            {stat.value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
