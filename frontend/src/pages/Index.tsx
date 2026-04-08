import { ConnectWalletButton } from "@/components/ConnectWallet";
import { StatsCards } from "@/components/StatsCards";
import { BudgetList, MockBudget } from "@/components/BudgetList";
import { ProposeBudget } from "@/components/ProposeBudget";
import { DepositFunds } from "@/components/DepositFunds";
import { EventsLog, MockEvent } from "@/components/EventsLog";
import { ManagersList } from "@/components/ManagersList";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BlockchainBackground } from "@/components/BlockchainBackground";
import { HashTicker } from "@/components/HashTicker";
import { Hexagon, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Mock Data
const MOCK_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD68";

const MOCK_MANAGERS = [
  "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD68",
  "0x8Ba1f109551bD432803012645Ac136ddd64DBA72",
  "0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
  "0x583031D1113aD414F02576BD6afaBfb302140225",
  "0x4B0897b0513FdB882d7e88E8a15E29f3bA4c2E7c",
];

const MOCK_BUDGETS: MockBudget[] = [
  {
    id: 0,
    recipient: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    amount: "2.5000",
    released: true,
    approvals: 5,
    timestamp: Date.now() - 86400000 * 3,
  },
  {
    id: 1,
    recipient: "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    amount: "1.2500",
    released: false,
    approvals: 3,
    timestamp: Date.now() - 86400000,
  },
  {
    id: 2,
    recipient: "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB",
    amount: "0.7500",
    released: false,
    approvals: 1,
    timestamp: Date.now() - 3600000 * 4,
  },
];

const MOCK_EVENTS: MockEvent[] = [
  {
    name: "Deposit",
    args: { sender: "0x742d...bD68", amount: "5.0 ETH" },
    transactionHash: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
  },
  {
    name: "BudgetProposed",
    args: { budgetId: "0", recipient: "0xAb84...5cb2", amount: "2.5 ETH" },
    transactionHash: "0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1",
  },
  {
    name: "BudgetApproved",
    args: { budgetId: "0", approver: "0x742d...bD68" },
    transactionHash: "0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2",
  },
  {
    name: "BudgetReleased",
    args: { budgetId: "0", recipient: "0xAb84...5cb2", amount: "2.5 ETH" },
    transactionHash: "0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3",
  },
];

const MOCK_BALANCE = "12.4530";

// Page
const Index = () => {
  const approvedCount = MOCK_BUDGETS.filter(
    (b) => b.approvals === MOCK_MANAGERS.length && !b.released
  ).length;
  const releasedCount = MOCK_BUDGETS.filter((b) => b.released).length;

  // Always show the connected/dashboard state
  const isConnected = true;

  return (
    <div className="relative min-h-screen bg-background">
      <BlockchainBackground />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary glow-primary-sm">
              <Hexagon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-none text-foreground">
                MultiSig Budget
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground">Treasury Management</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <ConnectWalletButton
              address={MOCK_ADDRESS}
              onConnect={() => {}}
              onDisconnect={() => {}}
            />
          </div>
        </div>
      </header>

      {/* Hash Ticker */}
      <HashTicker />

      <main className="container relative z-10 py-8">
        {!isConnected ? (
          /* Not connected state */
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 glow-primary animate-float">
              <Hexagon className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground" style={{ lineHeight: "1.1" }}>
              MultiSig Treasury
            </h2>
            <p className="mb-8 max-w-md text-muted-foreground">
              A secure multi-signature budget management system. Connect your wallet
              to propose, approve, and release budgets with 5-of-5 manager consensus.
            </p>
            <Button size="lg" className="gap-2">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          </div>
        ) : (
          /* Connected state */
          <div className="space-y-8">
            {/* Stats */}
            <StatsCards
              balance={MOCK_BALANCE}
              totalBudgets={MOCK_BUDGETS.length}
              approvedBudgets={approvedCount}
              releasedBudgets={releasedCount}
            />

            {/* Main grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left column: Budgets */}
              <div className="space-y-6 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Budgets</h2>
                </div>
                <BudgetList
                  budgets={MOCK_BUDGETS}
                  managerCount={MOCK_MANAGERS.length}
                />
              </div>

              {/* Right column: Actions & Info */}
              <div className="space-y-6">
                <ProposeBudget />

                <DepositFunds balance={MOCK_BALANCE} />

                <ManagersList
                  managers={MOCK_MANAGERS}
                  currentAddress={MOCK_ADDRESS}
                />

                <EventsLog events={MOCK_EVENTS} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-6">
        <div className="container flex items-center justify-between text-xs text-muted-foreground">
          <span>MultiSig Budget Manager</span>
          <span className="font-mono">5-of-5 Consensus</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
