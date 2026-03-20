import { CheckCircle2, Clock, ArrowRight, Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface MockBudget {
  id: number;
  recipient: string;
  amount: string;
  released: boolean;
  approvals: number;
  timestamp: number;
}

interface BudgetListProps {
  budgets: MockBudget[];
  managerCount: number;
}

export function BudgetList({ budgets, managerCount }: BudgetListProps) {
  if (budgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center">
        <div className="mb-3 rounded-full bg-secondary p-4">
          <Hexagon className="h-6 w-6 text-muted-foreground" />
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
        const progress = (budget.approvals / managerCount) * 100;

        return (
          <div
            key={budget.id}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 animate-block-stack"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {/* Side accent bar */}
            <div className={`absolute left-0 top-0 h-full w-1 transition-colors ${
              budget.released ? "bg-accent" : progress === 100 ? "bg-primary" : "bg-border"
            }`} />

            <div className="flex items-start justify-between gap-4 pl-3">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">
                    #{budget.id}
                  </span>
                  {budget.released ? (
                    <span className="flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                      <CheckCircle2 className="h-3 w-3" /> Released
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
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
                    {budget.amount}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">ETH</span>
                </div>

                {/* Approval progress */}
                <div className="mt-3">
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className={budget.released ? "text-accent" : "text-muted-foreground"}>
                      {budget.approvals}/{managerCount} approvals
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(budget.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        budget.released ? "bg-accent" : "bg-primary"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {!budget.released && (
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 gap-1.5 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Approve <ArrowRight className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
