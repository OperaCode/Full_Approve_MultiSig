export const CONTRACT_ABI = [
  // Read functions
  "function managers(uint256) view returns (address)",
  "function isManager(address) view returns (bool)",
  "function approvals(uint256, address) view returns (bool)",
  "function budgets(uint256) view returns (address recipient, uint256 amount, bool released, uint256 approvals, uint256 timestamp)",
  "function getBudgetStatus(uint256 _budgetId) view returns (address recipient, uint256 amount, uint256 approvalCount, uint256 timestamp)",
  "function getmanagers() view returns (address[])",
  "function getBudgets() view returns (tuple(address recipient, uint256 amount, bool released, uint256 approvals, uint256 timestamp)[])",

  // Write functions
  "function proposeBudget(address _recipient, uint256 _amount)",
  "function approveBudget(uint256 _budgetId)",

  // Events
  "event Deposit(address indexed sender, uint256 amount)",
  "event BudgetProposed(uint256 indexed budgetId, address indexed recipient, uint256 amount)",
  "event BudgetApproved(uint256 indexed budgetId, address indexed approver)",
  "event BudgetReleased(uint256 indexed budgetId, address indexed recipient, uint256 amount)",
] as const;

// Replace with your deployed contract address
export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
