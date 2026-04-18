# FullApprove — Multi-Signature Budget Management System

A decentralised treasury management system where exactly **5 managers must unanimously approve** every budget before funds are automatically released. Built on Ethereum with a React frontend.

---

## How It Works

1. Any manager proposes a budget (recipient address + amount in ETH).
2. Each of the 5 managers approves the budget independently.
3. Once all 5 approvals are collected, funds are automatically transferred to the recipient.
4. If the contract is underfunded at the time of the final approval, any manager can call `releaseBudget` after topping up the balance.

---

## Project Structure

```
FullApprove_MS/
├── contracts/
│   └── MultiSig_hardhat/       # Hardhat project
│       ├── contracts/
│       │   └── MultiSigBudget.sol
│       ├── test/
│       │   └── MultiSigBudget.ts
│       ├── scripts/
│       │   └── Getdeployer.ts
│       ├── deployments/
│       │   └── sepolia.json    # Deployed contract info
│       └── hardhat.config.ts
└── frontend/                   # React + Vite app
    └── src/
        ├── pages/
        ├── components/
        ├── hooks/
        └── lib/
```

---

## Smart Contract

**Contract:** `MultiSigBudget.sol`
**Network:** Sepolia Testnet
**Address:** `0x490eDdb4F21cF923D6510D1b35f320f7b506d577`
**Chain ID:** `11155111`
**Deployer:** `0x9f77a0c62CefcD939d100296e13dD67CB3dfAdAC`


---

## Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd FullApprove_MS
```

### 2. Set up the smart contract environment

```bash
cd contracts/MultiSig_hardhat
npm install
```

Copy the environment template and fill in your values:

```bash
cp .env.example .env
```

`.env` variables required:

```env
PRIVATE_KEY=your_wallet_private_key_without_0x_prefix
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

> **Never commit your `.env` file.** It is listed in `.gitignore`.

### 3. Set up the frontend

```bash
cd ../../frontend
npm install
```

---

## Running Locally

### Start the frontend dev server

```bash
cd frontend
npm run dev
```

---

## Smart Contract Development

### Compile

```bash
cd contracts/MultiSig_hardhat
npx hardhat compile
```

### Run tests

```bash
npx hardhat test
```

### Deploy to Sepolia

```bash
npx hardhat ignition deploy ignition/modules/<module-file> --network sepolia
```

After deployment, update `deployments/sepolia.json` with the new address, and update `CONTRACT_ADDRESS` in `frontend/src/lib/contract.ts`.

---

### Available scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build locally
npm run test         # Run unit tests
npm run lint         # Lint the codebase
```

---

## Security Notes

- The contract requires exactly 5 managers set at deployment — they cannot be changed after deployment.
- All manager approvals are tracked on-chain; no manager can approve the same budget twice.
- Funds are held in the contract and only released to the designated recipient after full approval.
- **Keep your private key secure.** Never push `.env` to version control.

---

## License

MIT
