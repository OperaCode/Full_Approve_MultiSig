import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";

export function ConnectWalletButton({
  address,
  onConnect,
  onDisconnect,
}: {
  address: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  if (address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-node-pulse" />
          <span className="font-mono text-sm text-foreground">
            {address.slice(0, 6)}…{address.slice(-4)}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDisconnect}
          className="text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={onConnect} className="gap-2">
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  );
}
