import { ContractEvent } from "@/hooks/useContract";
import { Activity, ArrowDown, FileText, CheckCircle, Banknote } from "lucide-react";

interface EventsLogProps {
  events: ContractEvent[];
}

const eventIcons: Record<string, React.ReactNode> = {
  Deposit: <ArrowDown className="h-3.5 w-3.5 text-primary" />,
  BudgetProposed: <FileText className="h-3.5 w-3.5 text-info" />,
  BudgetApproved: <CheckCircle className="h-3.5 w-3.5 text-warning" />,
  BudgetReleased: <Banknote className="h-3.5 w-3.5 text-primary" />,
};

export function EventsLog({ events }: EventsLogProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Live Events</h3>
        {events.length > 0 && (
          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {events.length}
          </span>
        )}
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <div className="mb-2 h-2 w-2 rounded-full bg-primary/40 animate-pulse-glow" />
          <p className="text-sm text-muted-foreground">Listening for events…</p>
        </div>
      ) : (
        <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
          {events.map((event, i) => (
            <div
              key={`${event.transactionHash}-${i}`}
              className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3 animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="mt-0.5 shrink-0 rounded-md bg-secondary p-1.5">
                {eventIcons[event.name] ?? <Activity className="h-3.5 w-3.5 text-muted-foreground" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{event.name}</p>
                <div className="mt-1 space-y-0.5">
                  {Object.entries(event.args).map(([key, val]) => (
                    <p key={key} className="text-xs text-muted-foreground">
                      <span className="text-secondary-foreground">{key}:</span>{" "}
                      <span className="font-mono">{val}</span>
                    </p>
                  ))}
                </div>
                {event.transactionHash && (
                  <p className="mt-1 truncate font-mono text-xs text-muted-foreground/60">
                    tx: {event.transactionHash.slice(0, 14)}…
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
