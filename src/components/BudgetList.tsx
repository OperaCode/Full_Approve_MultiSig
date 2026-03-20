import { formatEther } from "ethers";
import { Budget } from "@/hooks/useContract";
import { CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface BudgetListProps {
  budgets: Budget[];
  managers: string[];
  isManager: boolean;
  onApprove: (id: number) => Promise<void>;
}

export function BudgetList({ budgets, managers, isManager, onApprove }: BudgetListProps) {
  const [approvingId, setApprovingId] = useState<number | null>(null);

  const handleApprove = async (id: number) => {
    setApprovingId(id);
    try {
      await onApprove(id);
    } catch (err) {
      console.error("Approval failed:", err);
    } finally {
      setApprovingId(null);
    }
  };

  if (budgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center">
        <div className="mb-3 rounded-full bg-secondary p-4">
          <Clock className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-lg font-medium text-foreground">No budgets yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Propose a budget to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {budgets.map((budget, index) => {
        const progress = (budget.approvals / managers.length) * 100;
        const statusColor = budget.released
          ? "text-primary"
          : budget.approvals === managers.length
          ? "text-warning"
          : "text-muted-foreground";

        return (
          <div
            key={index}
            className="group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">
                    #{index}
                  </span>
                  {budget.released ? (
                    <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      <CheckCircle2 className="h-3 w-3" /> Released
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      <Clock className="h-3 w-3" /> Pending
                    </span>
                  )}
                </div>

                <div className="mb-3 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">To:</span>
                  <span className="font-mono text-sm text-foreground">
                    {budget.recipient.slice(0, 10)}…{budget.recipient.slice(-6)}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold tabular-nums text-foreground">
                    {formatEther(budget.amount)}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">ETH</span>
                </div>

                {/* Approval progress */}
                <div className="mt-3">
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className={statusColor}>
                      {budget.approvals}/{managers.length} approvals
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(budget.timestamp * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {isManager && !budget.released && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleApprove(index)}
                  disabled={approvingId === index}
                  className="shrink-0 gap-1.5 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  {approvingId === index ? (
                    "Approving…"
                  ) : (
                    <>
                      Approve <ArrowRight className="h-3 w-3" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
