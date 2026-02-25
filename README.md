🏦 MultiSigBudget Smart Contract

A Solidity-based Multi-Signature Budget Management Contract that allows a fixed group of managers to:

Propose budget transfers

Approve budget proposals

Automatically release funds once all managers approve

Prevent double approvals

Ensure funds exist before release

Built with Solidity ^0.8.28.

📌 Overview

MultiSigBudget is a treasury control contract where:

Exactly 5 managers are defined at deployment.

A manager proposes a budget.

All 5 managers must approve.

On the final approval, funds are automatically released.

The contract prevents:

Double approvals

Unauthorized access

Insufficient balance transfers

This contract simulates a company board approving expenses before funds are disbursed.

🏗 Contract Architecture
State Variables
address[] public managers;
mapping(address => bool) public isManager;
mapping(uint256 => mapping(address => bool)) public approvals;
Budget[] public budgets;

Explanation
Variable	Purpose
managers	List of authorized managers
isManager	Fast lookup to check manager permissions
approvals	Tracks which manager approved which budget
budgets	Stores all proposed budgets

📦 Budget Structure
struct Budget {
    address payable recipient;
    uint256 amount;
    bool released;
    uint256 approvals;
    uint256 timestamp;
}

Each budget contains:

Recipient address

Transfer amount

Release status

Approval count

Proposal timestamp

🔐 Access Control

Only managers can:

Propose budgets

Approve budgets

modifier onlyManager()

Unauthorized users revert with:

error NotManager();

💰 Funding the Contract

The contract can receive Ether directly:

receive() external payable

Every deposit emits:

event Deposit(address indexed sender, uint256 amount);

📝 Core Functions
1️⃣ Propose Budget
function proposeBudget(address payable _recipient, uint256 _amount)

Only managers

Creates a new budget entry

Emits BudgetProposed

2️⃣ Approve Budget
function approveBudget(uint256 _budgetId)

Only managers

Prevents double approval

Increments approval count

Automatically releases funds once all managers approve

Emits:

BudgetApproved
BudgetReleased (on final approval)
3️⃣ Automatic Release Logic

Funds are released automatically when:

budget.approvals == managers.length

The contract checks:

Budget not already released

Sufficient contract balance

All approvals completed

🚫 Error Handling

Custom errors used for gas efficiency:

error NotManager();
error AlreadyApproved();
error InvalidBudgetId();
error BudgetAlreadyReleased();
error InsufficientFunds();
error ApprovalPending();
🔄 Contract Flow
Step 1 — Deploy

Provide exactly 5 manager addresses

Step 2 — Fund Contract

Send ETH directly to contract address

Step 3 — Propose Budget

Manager submits recipient and amount

Step 4 — Approve

Each manager approves once

Step 5 — Automatic Release

5th approval triggers transfer

🧪 Testing

Designed to work with:

Hardhat

Ethers v6

Chai

loadFixture

Important:

Must deploy with exactly 5 managers

Must fund contract before testing release

Ethers v6 returns bigint for uint values

Example:

expect(budget.approvals).to.equal(1n);
⚙️ Constructor Requirement
constructor(address[] memory _managers)

Must provide exactly 5 addresses

Reverts otherwise

require(_managers.length == 5, "Must have exactly 5 managers");

🔐 Security Features

✔ Prevents double approvals
✔ Prevents release before full approval
✔ Prevents release if insufficient funds
✔ Restricts actions to managers only
✔ Uses custom errors for gas optimization


📚 Learning Concepts Covered

Multi-signature wallet logic

Nested mappings

Struct storage

Custom errors

Access modifiers

Automatic execution conditions

Event-driven architecture

📜 License

MIT

👨‍💻 Author

Raphael Faboyinde
Solidity | Smart Contracts | MultiSig Systems | Web3 Infrastructure