import { useWallet } from "@/hooks/useWallet";
import { useContract } from "@/hooks/useContract";
import { ConnectWalletButton } from "@/components/ConnectWallet";
import { StatsCards } from "@/components/StatsCards";
import { BudgetList } from "@/components/BudgetList";
import { ProposeBudget } from "@/components/ProposeBudget";
import { DepositFunds } from "@/components/DepositFunds";
import { EventsLog } from "@/components/EventsLog";
import { ManagersList } from "@/components/ManagersList";
import { useEffect } from "react";
import { Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const wallet = useWallet();
  const contract = useContract(wallet.signer, wallet.provider);

  useEffect(() => {
    if (wallet.signer) contract.refresh();
  }, [wallet.signer]);

  const approvedCount = contract.budgets.filter(
    (b) => b.approvals === contract.managers.length && !b.released
  ).length;
  const releasedCount = contract.budgets.filter((b) => b.released).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary glow-green-sm">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-none text-foreground">
                MultiSig Budget
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground">Treasury Management</p>
            </div>
          </div>

          <ConnectWalletButton
            address={wallet.address}
            isConnecting={wallet.isConnecting}
            error={wallet.error}
            onConnect={wallet.connect}
            onDisconnect={wallet.disconnect}
          />
        </div>
      </header>

      <main className="container py-8">
        {!wallet.address ? (
          /* Not connected state */
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-fade-up">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 glow-green">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground" style={{ lineHeight: "1.1" }}>
              MultiSig Treasury
            </h2>
            <p className="mb-8 max-w-md text-muted-foreground">
              A secure multi-signature budget management system. Connect your wallet
              to propose, approve, and release budgets with 5-of-5 manager consensus.
            </p>
            <Button onClick={wallet.connect} size="lg" className="gap-2">
              <Shield className="h-4 w-4" />
              Connect Wallet
            </Button>
          </div>
        ) : (
          /* Connected state */
          <div className="space-y-8 animate-fade-up">
            {/* Stats */}
            <StatsCards
              balance={contract.balance}
              totalBudgets={contract.budgets.length}
              approvedBudgets={approvedCount}
              releasedBudgets={releasedCount}
            />

            {/* Main grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left column: Budgets */}
              <div className="space-y-6 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Budgets</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={contract.refresh}
                    disabled={contract.loading}
                    className="gap-1.5 text-muted-foreground"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${contract.loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
                <BudgetList
                  budgets={contract.budgets}
                  managers={contract.managers}
                  isManager={contract.isManager}
                  onApprove={contract.approveBudget}
                />
              </div>

              {/* Right column: Actions & Info */}
              <div className="space-y-6">
                {contract.isManager && (
                  <ProposeBudget
                    onPropose={contract.proposeBudget}
                    disabled={!wallet.signer}
                  />
                )}

                <DepositFunds
                  onDeposit={contract.deposit}
                  balance={contract.balance}
                  disabled={!wallet.signer}
                />

                <ManagersList
                  managers={contract.managers}
                  currentAddress={wallet.address}
                />

                <EventsLog events={contract.events} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container flex items-center justify-between text-xs text-muted-foreground">
          <span>MultiSig Budget Manager</span>
          <span>5-of-5 Consensus</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
