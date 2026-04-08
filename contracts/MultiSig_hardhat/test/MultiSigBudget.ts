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

  it("reverts deployment when a manager is zero address", async () => {
    const signers = await ethers.getSigners();
    const MultiSigBudget = await ethers.getContractFactory("MultiSigBudget");

    await expect(
      MultiSigBudget.deploy([
        signers[0].address,
        signers[1].address,
        signers[2].address,
        signers[3].address,
        ethers.ZeroAddress,
      ])
    ).to.be.revertedWithCustomError(MultiSigBudget, "InvalidManagerAddress");
  });

  it("reverts deployment when managers contain duplicates", async () => {
    const signers = await ethers.getSigners();
    const MultiSigBudget = await ethers.getContractFactory("MultiSigBudget");

    await expect(
      MultiSigBudget.deploy([
        signers[0].address,
        signers[1].address,
        signers[2].address,
        signers[3].address,
        signers[0].address,
      ])
    ).to.be.revertedWithCustomError(MultiSigBudget, "DuplicateManager");
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

  it("reverts proposing a budget with zero recipient", async () => {
    const { multiSigBudget, owner } = await loadFixture(deployFixture);

    await expect(
      multiSigBudget.connect(owner).proposeBudget(ethers.ZeroAddress, ethers.parseEther("1"))
    ).to.be.revertedWithCustomError(multiSigBudget, "InvalidRecipient");
  });

  it("reverts proposing a budget with zero amount", async () => {
    const { multiSigBudget, owner, recipient } = await loadFixture(deployFixture);

    await expect(
      multiSigBudget.connect(owner).proposeBudget(recipient.address, 0)
    ).to.be.revertedWithCustomError(multiSigBudget, "InvalidAmount");
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
