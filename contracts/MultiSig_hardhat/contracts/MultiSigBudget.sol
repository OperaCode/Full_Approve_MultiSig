// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MultiSigBudget {
    
    // State variables
    address[] public managers;
    mapping(address => bool) public isManager;
    mapping(uint256 => mapping(address => bool)) public approvals;
    Budget[] public budgets;

    struct Budget {
        address payable recipient;
        uint256 amount;
        bool released;
        uint256 approvals;
        uint256 timestamp; 
    }
  
    // Events
    event Deposit(address indexed sender, uint256 amount);
    event BudgetProposed(uint256 indexed budgetId, address indexed recipient, uint256 amount);
    event BudgetApproved(uint256 indexed budgetId, address indexed approver);
    event BudgetReleased(uint256 indexed budgetId, address indexed recipient, uint256 amount);

    modifier onlyManager() {
        if (!isManager[msg.sender]) revert NotManager();
        _;
    }

    // Errors Handling
    error NotManager(); 
    error AlreadyApproved(); 
    error InvalidBudgetId();
    error BudgetAlreadyReleased();
    error InsufficientFunds();
    error ApprovalPending();
    error InvalidManagerAddress();
    error DuplicateManager();
    error InvalidRecipient();
    error InvalidAmount();

    constructor(address[] memory _managers) {
        require(_managers.length == 5, "Must have exactly 5 managers");
        for (uint256 i = 0; i < _managers.length; i++) {
            if (_managers[i] == address(0)) revert InvalidManagerAddress();
            if (isManager[_managers[i]]) revert DuplicateManager();
            managers.push(_managers[i]);
            isManager[_managers[i]] = true;
        }
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

//     const [deployer] = await ethers.getSigners();
// deployer.address

    // propose budget 
    function proposeBudget(address payable _recipient, uint256 _amount) external onlyManager {
        if (_recipient == address(0)) revert InvalidRecipient();
        if (_amount == 0) revert InvalidAmount();

        budgets.push(Budget({
            recipient: _recipient,
            amount: _amount,
            released: false,
            approvals: 0,
            timestamp: block.timestamp 
        }));
        emit BudgetProposed(budgets.length - 1, _recipient, _amount);
    }

    // approve budget by managers
    function approveBudget(uint256 _budgetId) external onlyManager {
        if (_budgetId >= budgets.length) revert InvalidBudgetId();

        Budget storage budget = budgets[_budgetId];

        if (budget.released) revert BudgetAlreadyReleased();
        if (approvals[_budgetId][msg.sender]) revert AlreadyApproved();

        approvals[_budgetId][msg.sender] = true;
        budget.approvals++;

        emit BudgetApproved(_budgetId, msg.sender);

        if (budget.approvals == managers.length) {
            releaseBudget(_budgetId);
        }
    }

    // Release Funds in a Budget  
    function releaseBudget(uint256 _budgetId) internal onlyManager {
        Budget storage budget = budgets[_budgetId];

        if (budget.approvals < managers.length) revert ApprovalPending();
        if (budget.released) revert BudgetAlreadyReleased();
        if (address(this).balance < budget.amount) revert InsufficientFunds();

        budget.released = true;
        budget.recipient.transfer(budget.amount);

        emit BudgetReleased(_budgetId, budget.recipient, budget.amount);
    }

    // Fetch status of a Budget
    function getBudgetStatus(uint256 _budgetId) external view returns (address recipient, uint256 amount, uint256 approvalCount, uint256 timestamp) {
        if (_budgetId >= budgets.length) revert InvalidBudgetId();
        Budget storage budget = budgets[_budgetId];
        return (budget.recipient, budget.amount, budget.approvals, budget.timestamp);
    }

    function getmanagers() external view returns (address[] memory) {
        return managers;
    }

    function getBudgets() external view returns (Budget[] memory) {
        return budgets;
    }
}
