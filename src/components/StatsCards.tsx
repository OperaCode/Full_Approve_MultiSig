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
      accent: true,
    },
    {
      label: "Total Budgets",
      value: totalBudgets.toString(),
      icon: <FileText className="h-5 w-5" />,
      accent: false,
    },
    {
      label: "Fully Approved",
      value: approvedBudgets.toString(),
      icon: <CheckCircle2 className="h-5 w-5" />,
      accent: false,
    },
    {
      label: "Released",
      value: releasedBudgets.toString(),
      icon: <Shield className="h-5 w-5" />,
      accent: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-xl border p-5 transition-all duration-300 ${
            stat.accent
              ? "border-primary/30 bg-primary/5 glow-green"
              : "border-border bg-card hover:border-primary/20"
          }`}
        >
          <div className={`mb-2 ${stat.accent ? "text-primary" : "text-muted-foreground"}`}>
            {stat.icon}
          </div>
          <p className="font-mono text-2xl font-semibold tabular-nums text-foreground">
            {stat.value}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
