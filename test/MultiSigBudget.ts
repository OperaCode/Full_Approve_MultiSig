import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MultiSigBudget", () => {
  async function deployFixture() {
    const signers = await ethers.getSigners();
    if (signers.length < 6) throw new Error("Need at least 6 signers");

    const owner = signers[0];
    const recipient = signers[1];
    const M3 = signers[2];
    const M4 = signers[3];
    const M5 = signers[4];

   
    const managers = [owner, recipient, M3, M4, M5];

    const MultiSigBudget = await ethers.getContractFactory("MultiSigBudget");
    const multiSigBudget = await MultiSigBudget.deploy(
      managers.map((m) => m.address)
    );
    await multiSigBudget.waitForDeployment();

    // fund contract (receive() exists, so this works)
    await owner.sendTransaction({
      to: await multiSigBudget.getAddress(),
      value: ethers.parseEther("100"),
    });

    return { multiSigBudget, owner, recipient, M3, M4, M5, managers };
  }

  it("sets the correct managers", async () => {
    const { multiSigBudget, managers } = await loadFixture(deployFixture);

    // NOTE: contract name is getmanagers()
    const members = await multiSigBudget.getmanagers();

    expect(members.length).to.equal(5);
    expect(members[0]).to.equal(managers[0].address);
  });

  it("allows a manager to propose a budget", async () => {
    const { multiSigBudget, owner, recipient } = await loadFixture(deployFixture);

    const amount = ethers.parseEther("10");
    await multiSigBudget.connect(owner).proposeBudget(recipient.address, amount);

    const budgets = await multiSigBudget.getBudgets();
    expect(budgets.length).to.equal(1);

    expect(budgets[0].recipient).to.equal(recipient.address);
    expect(budgets[0].amount).to.equal(amount);
    expect(budgets[0].approvals).to.equal(0n);
    expect(budgets[0].released).to.equal(false);
  });

  it("allows managers to approve and auto-releases on 5th approval", async () => {
    const { multiSigBudget, owner, recipient, M3, M4, M5 } =
      await loadFixture(deployFixture);

    const amount = ethers.parseEther("10");
    await multiSigBudget.connect(owner).proposeBudget(recipient.address, amount);
    const budgetId = 0;

    // approve 4 times first
    await multiSigBudget.connect(owner).approveBudget(budgetId);
    await multiSigBudget.connect(M3).approveBudget(budgetId);
    await multiSigBudget.connect(M4).approveBudget(budgetId);
    await multiSigBudget.connect(M5).approveBudget(budgetId);

    // 5th approval triggers release + event
    await expect(multiSigBudget.connect(recipient).approveBudget(budgetId))
      .to.emit(multiSigBudget, "BudgetReleased");

    const budget = (await multiSigBudget.getBudgets())[budgetId];
    expect(budget.released).to.equal(true);
    expect(budget.approvals).to.equal(5n);
  });

  it("prevents approving the same budget twice", async () => {
    const { multiSigBudget, owner, recipient } = await loadFixture(deployFixture);

    const amount = ethers.parseEther("10");
    await multiSigBudget.connect(owner).proposeBudget(recipient.address, amount);
    const budgetId = 0;

    await multiSigBudget.connect(owner).approveBudget(budgetId);

    await expect(multiSigBudget.connect(owner).approveBudget(budgetId))
      .to.be.revertedWithCustomError(multiSigBudget, "AlreadyApproved");
  });

  it("reverts on 5th approval if funds are insufficient", async () => {
    const { multiSigBudget, owner, recipient, M3, M4, M5 } =
      await loadFixture(deployFixture);

    const tooMuch = ethers.parseEther("1000"); // > 100 funded
    await multiSigBudget.connect(owner).proposeBudget(recipient.address, tooMuch);
    const budgetId = 0;

    // 4 approvals ok
    await multiSigBudget.connect(owner).approveBudget(budgetId);
    await multiSigBudget.connect(M3).approveBudget(budgetId);
    await multiSigBudget.connect(M4).approveBudget(budgetId);
    await multiSigBudget.connect(M5).approveBudget(budgetId);

    // 5th triggers release -> InsufficientFunds
    await expect(multiSigBudget.connect(recipient).approveBudget(budgetId))
      .to.be.revertedWithCustomError(multiSigBudget, "InsufficientFunds");
  });
});
















// import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
// import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
// import { expect } from "chai";
// import { ethers } from "hardhat";

// describe("MultiSigBudget", () => {
//   async function deployMultiSigBudgetFixture() {
//     const signers = await ethers.getSigners();

//     if (signers.length < 5) {
//       throw new Error("Test requires at least 5 managers");
//     }

//     const owner = signers[0];
//     const recipient = signers[1];
//     const M3 = signers[2];
//     const M4 = signers[3];
//     const M5 = signers[4];
//     const M6 = signers[5];

//     const managers = signers;


//     // Deploy the CompanyMultiSig contract with 20 board members
//     const MultiSigBudget = await ethers.getContractFactory("MultiSigBudget");
//     const multiSigBudget = await MultiSigBudget.deploy(managers.slice(0, 5).map((b) => b.address));
//     await multiSigBudget.waitForDeployment();

//     // Fund the contract with initial deposit
//     const initialDeposit = ethers.parseEther("100"); // 100 Ether initial deposit
//     await owner.sendTransaction({
//       to: multiSigBudget.target,
//       value: initialDeposit,
//     });

//     return { multiSigBudget, owner, M3, M4, M5, M6, managers, recipient };
//   }

//   describe("Deployment", () => {
//     it("Should set the correct managers", async () => {
//       const { multiSigBudget, managers } = await loadFixture(deployMultiSigBudgetFixture);
//       const members = await multiSigBudget.getManagers();
//       expect(members.length).to.equal(20);
//       expect(members[0]).to.equal(managers[0].address);
//     });
//   });

//   describe("Propose and Approve Budget", () => {
//     it("Should allow a manager to propose a budget", async () => {
//       const { multiSigBudget, owner, managers, recipient } = await loadFixture(deployMultiSigBudgetFixture);
//       const budgetAmount = ethers.parseEther("10"); // 10 Ether budget

//       // Manager proposes a budget
//       await multiSigBudget.connect(owner).proposeBudget(recipient.address, budgetAmount);

//       // Check if the budget is proposed correctly
//       const budgets = await multiSigBudget.getBudgets();
//       expect(budgets.length).to.equal(1); 
//       expect(budgets[0].recipient).to.equal(recipient.address);
//       expect(budgets[0].amount.toString()).to.equal(budgetAmount.toString());
//     });

//     it("Should allow managers to approve a proposed budget", async () => {
//       const { multiSigBudget, owner, recipient, managers } = await loadFixture(deployMultiSigBudgetFixture);
//       const budgetAmount = ethers.parseEther("10"); // 10 Ether budget
//       await multiSigBudget.connect(owner).proposeBudget(owner.address, budgetAmount);
//       const budgetId = 0;

//       // First approval by a manager
//       await multiSigBudget.connect(owner).approveBudget(budgetId);
//       const budget = (await multiSigBudget.getBudgets())[budgetId];
//       expect(budget.approvals).to.equal(1); // 1 approval

//       // Second approval by another board member
//       await multiSigBudget.connect(recipient).approveBudget(budgetId);
//       const updatedBudget = (await multiSigBudget.getBudgets())[budgetId];
//       expect(updatedBudget.approvals).to.equal(2); // 2 approvals
//     });

//     it("Should prevent a manager from approving the same budget twice", async () => {
//       const { multiSigBudget, owner, M3, managers } = await loadFixture(deployMultiSigBudgetFixture);
//       const budgetAmount = ethers.parseEther("10");
//       await multiSigBudget.connect(owner).proposeBudget(owner.address, budgetAmount);
//       const budgetId = 0;

//       // First approval
//       await multiSigBudget.connect(M3).approveBudget(budgetId);

//       // Try approving again
//       await expect(companyMultiSig.connect(bM3).approveBudget(budgetId))
//         .to.be.revertedWithCustomError(companyMultiSig, "AlreadyApproved");
//     });
//   });

//   describe("Release Funds", () => {
//     it("Should release funds once all board members approve", async () => {
//       const { companyMultiSig, bM5, boardMembers, recipient } = await loadFixture(deployCompanyMultiSigFixture);
//       const budgetAmount = ethers.parseEther("10");
//       // Propose the budget
//       await companyMultiSig.connect(bM5).proposeBudget(recipient.address, budgetAmount);
//       const budgetId = 0;

//      // Approve the budget by all board members
//      for (let i = 0; i < 19; i++) {
//       await companyMultiSig.connect(boardMembers[i]).approveBudget(budgetId);
//     }

//      await expect(companyMultiSig.connect(boardMembers[19]).approveBudget(budgetId)).to.emit(companyMultiSig, "BudgetReleased");
//     });

//     it("Should not release funds if not all board members approve", async () => {
//       const { companyMultiSig, bM4, bM3, boardMembers, recipient } = await loadFixture(deployCompanyMultiSigFixture);
//       const budgetAmount = ethers.parseEther("10");

//       // Propose the budget
//       await companyMultiSig.connect(bM4).proposeBudget(recipient.address, budgetAmount);
//       const budgetId = 0;

//       // Approve by only one board member
//       await companyMultiSig.connect(bM3).approveBudget(budgetId);

//       // Try to release funds before all approvals
//       await expect(companyMultiSig.releaseBudget(budgetId)).to.be.revertedWithCustomError(companyMultiSig, "ApprovalPending");
//     });

//     it("Should revert if there are insufficient funds", async () => {
//       const { companyMultiSig, owner, boardMembers, recipient } = await loadFixture(deployCompanyMultiSigFixture);
//       const insufficientAmount = ethers.parseEther("1000"); // More than the balance

//       // Propose a budget with insufficient funds
//       await companyMultiSig.connect(owner).proposeBudget(recipient.address, insufficientAmount);
//       const budgetId = 0;
      
//       // Approve the budget by all board members
//       for (let i = 0; i < 19; i++) {
//         await companyMultiSig.connect(boardMembers[i]).approveBudget(budgetId);
//       }

//       // Expect the 20th approval to trigger an automatic failure due to insufficient funds
//       await expect(companyMultiSig.connect(boardMembers[19]).approveBudget(budgetId)).to.be.revertedWithCustomError(companyMultiSig, "InsufficientFunds");

//     });
//   });
// });