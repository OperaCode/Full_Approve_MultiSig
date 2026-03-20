import { Users } from "lucide-react";

interface ManagersListProps {
  managers: string[];
  currentAddress: string | null;
}

export function ManagersList({ managers, currentAddress }: ManagersListProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Users className="h-4 w-4 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Managers</h3>
        <span className="ml-auto text-sm text-muted-foreground">{managers.length}/5</span>
      </div>

      {managers.length === 0 ? (
        <p className="text-sm text-muted-foreground">Connect wallet to view managers</p>
      ) : (
        <div className="space-y-2">
          {managers.map((addr, i) => {
            const isYou = currentAddress?.toLowerCase() === addr.toLowerCase();
            return (
              <div
                key={addr}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  isYou ? "bg-primary/10 border border-primary/20" : "bg-secondary/50"
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    isYou
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <span className="font-mono text-sm text-foreground">
                  {addr.slice(0, 8)}…{addr.slice(-6)}
                </span>
                {isYou && (
                  <span className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                    You
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
