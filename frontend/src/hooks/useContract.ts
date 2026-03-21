import { useState, useCallback, useEffect } from "react";
import { Contract, formatEther, parseEther } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { JsonRpcSigner, BrowserProvider } from "ethers";

export interface Budget {
  recipient: string;
  amount: bigint;
  released: boolean;
  approvals: number;
  timestamp: number;
}

export interface ContractEvent {
  name: string;
  args: Record<string, string>;
  blockNumber: number;
  transactionHash: string;
}

export function useContract(
  signer: JsonRpcSigner | null,
  provider: BrowserProvider | null
) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [managers, setManagers] = useState<string[]>([]);
  const [balance, setBalance] = useState<string>("0");
  const [events, setEvents] = useState<ContractEvent[]>([]);
  const [isManager, setIsManager] = useState(false);
  const [loading, setLoading] = useState(false);

  const getContract = useCallback(() => {
    if (!signer) return null;
    return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }, [signer]);

  const getReadContract = useCallback(() => {
    if (!provider) return null;
    return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  }, [provider]);

  // Fetch all data
  const refresh = useCallback(async () => {
    const contract = getReadContract();
    if (!contract || !provider) return;

    setLoading(true);
    try {
      const [budgetsData, managersData, bal] = await Promise.all([
        contract.getBudgets(),
        contract.getmanagers(),
        provider.getBalance(CONTRACT_ADDRESS),
      ]);

      setBudgets(
        budgetsData.map((b: any) => ({
          recipient: b.recipient,
          amount: b.amount,
          released: b.released,
          approvals: Number(b.approvals),
          timestamp: Number(b.timestamp),
        }))
      );
      setManagers(managersData);
      setBalance(formatEther(bal));
    } catch (err) {
      console.error("Failed to fetch contract data:", err);
    } finally {
      setLoading(false);
    }
  }, [getReadContract, provider]);

  // Check if connected wallet is a manager
  useEffect(() => {
    async function check() {
      const contract = getReadContract();
      if (!contract || !signer) return;
      try {
        const addr = await signer.getAddress();
        const result = await contract.isManager(addr);
        setIsManager(result);
      } catch {
        setIsManager(false);
      }
    }
    check();
  }, [signer, getReadContract]);

  // Listen to events
  useEffect(() => {
    const contract = getReadContract();
    if (!contract) return;

    const handleEvent = (name: string) => (...args: any[]) => {
      const event = args[args.length - 1]; // last arg is the event log
      const newEvent: ContractEvent = {
        name,
        args: {},
        blockNumber: event?.log?.blockNumber ?? 0,
        transactionHash: event?.log?.transactionHash ?? "",
      };

      if (name === "Deposit") {
        newEvent.args = { sender: args[0], amount: formatEther(args[1]) };
      } else if (name === "BudgetProposed") {
        newEvent.args = {
          budgetId: args[0].toString(),
          recipient: args[1],
          amount: formatEther(args[2]),
        };
      } else if (name === "BudgetApproved") {
        newEvent.args = {
          budgetId: args[0].toString(),
          approver: args[1],
        };
      } else if (name === "BudgetReleased") {
        newEvent.args = {
          budgetId: args[0].toString(),
          recipient: args[1],
          amount: formatEther(args[2]),
        };
      }

      setEvents((prev) => [newEvent, ...prev].slice(0, 50));
      refresh();
    };

    contract.on("Deposit", handleEvent("Deposit"));
    contract.on("BudgetProposed", handleEvent("BudgetProposed"));
    contract.on("BudgetApproved", handleEvent("BudgetApproved"));
    contract.on("BudgetReleased", handleEvent("BudgetReleased"));

    return () => {
      contract.removeAllListeners();
    };
  }, [getReadContract, refresh]);

  // Actions
  const proposeBudget = useCallback(
    async (recipient: string, amountEth: string) => {
      const contract = getContract();
      if (!contract) throw new Error("Wallet not connected");
      const tx = await contract.proposeBudget(recipient, parseEther(amountEth));
      await tx.wait();
      await refresh();
    },
    [getContract, refresh]
  );

  const approveBudget = useCallback(
    async (budgetId: number) => {
      const contract = getContract();
      if (!contract) throw new Error("Wallet not connected");
      const tx = await contract.approveBudget(budgetId);
      await tx.wait();
      await refresh();
    },
    [getContract, refresh]
  );

  const deposit = useCallback(
    async (amountEth: string) => {
      if (!signer) throw new Error("Wallet not connected");
      const tx = await signer.sendTransaction({
        to: CONTRACT_ADDRESS,
        value: parseEther(amountEth),
      });
      await tx.wait();
      await refresh();
    },
    [signer, refresh]
  );

  return {
    budgets,
    managers,
    balance,
    events,
    isManager,
    loading,
    refresh,
    proposeBudget,
    approveBudget,
    deposit,
  };
}
