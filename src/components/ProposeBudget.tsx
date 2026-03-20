import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export function ProposeBudget() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Propose Budget</h3>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
            Recipient Address
          </label>
          <Input
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="font-mono bg-secondary/50 border-border"
          />
        </div>

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

        <Button className="w-full gap-2">
          <Send className="h-4 w-4" />
          Propose Budget
        </Button>
      </div>
    </div>
  );
}
