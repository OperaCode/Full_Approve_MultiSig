import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownToLine } from "lucide-react";

export function DepositFunds({ balance }: { balance: string }) {
  const [amount, setAmount] = useState("");

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Deposit Funds</h3>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Treasury Balance</p>
          <p className="font-mono text-lg font-semibold tabular-nums text-primary">
            {parseFloat(balance).toFixed(4)} ETH
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
            Amount (ETH)
          </label>
          <Input
            type="number"
            step="0.001"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="font-mono bg-secondary/50 border-border"
          />
        </div>

        <Button
          variant="outline"
          className="w-full gap-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <ArrowDownToLine className="h-4 w-4" />
          Deposit ETH
        </Button>
      </div>
    </div>
  );
}
