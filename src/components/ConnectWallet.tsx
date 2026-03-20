import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, AlertCircle } from "lucide-react";

export function ConnectWallet() {
  const { address, isConnecting, error, connect, disconnect } = useWallet();

  // Expose wallet globally for other components
  // We'll use context instead — see WalletProvider
  return null;
}

// Standalone button for the header
export function ConnectWalletButton({
  address,
  isConnecting,
  error,
  onConnect,
  onDisconnect,
}: {
  address: string | null;
  isConnecting: boolean;
  error: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  if (address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
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
    <div className="flex items-center gap-2">
      <Button onClick={onConnect} disabled={isConnecting} className="gap-2">
        <Wallet className="h-4 w-4" />
        {isConnecting ? "Connecting…" : "Connect Wallet"}
      </Button>
      {error && (
        <div className="flex items-center gap-1 text-sm text-destructive">
          <AlertCircle className="h-3 w-3" />
          <span className="max-w-48 truncate">{error}</span>
        </div>
      )}
    </div>
  );
}
