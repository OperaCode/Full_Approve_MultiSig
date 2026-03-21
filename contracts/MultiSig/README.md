# 🏦 MultiSigBudget Smart Contract

A Solidity-based **Multi-Signature Budget Management Contract** that allows a fixed group of managers to:

- Propose budget transfers
- Approve budget proposals
- Automatically release funds once all managers approve
- Prevent double approvals
- Ensure sufficient funds before release

Built with **Solidity ^0.8.28**

---

## 📌 Overview

`MultiSigBudget` is a treasury control smart contract where:

- Exactly **5 managers** are defined at deployment
- A manager proposes a budget
- All managers must approve the budget
- On the final approval, funds are automatically released
- The contract prevents:
  - Unauthorized access
  - Double approvals
  - Insufficient balance transfers

This contract simulates how a company board approves expenses before funds are disbursed.

---

## 📜 License

MIT

## 👨‍💻 Author

Raphael Faboyinde
Solidity • Smart Contracts • MultiSig Systems • Web3 Infrastructure