
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MultiSigBudget = buildModule("MultiSigBudget", (m) => {
  
  // 🔥 dynamic managers input
  const managers = m.getParameter("managers");

  // Deploy contract
  const multisig = m.contract("MultiSigBudget", [managers]);

  return { multisig };
});

export default MultiSigBudget;