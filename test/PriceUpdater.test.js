const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PriceUpdater Contracts", function () {
  let priceUpdater;
  let linkToken;
  let mockOracle;
  let owner, addr1;
  let marketplace;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    // Deploy LinkToken contract
    const LinkToken = await ethers.getContractFactory("LinkToken");
    linkToken = await LinkToken.deploy();
    await linkToken.deployTransaction.wait(); // Wait for the deployment transaction to be mined

    // Deploy MockOracle with LinkToken address
    const MockOracle = await ethers.getContractFactory("MockOracle");
    mockOracle = await MockOracle.deploy(linkToken.address);  // Use linkToken's address
    await mockOracle.deployTransaction.wait(); // Wait for the deployment transaction to be mined

    // Deploy Marketplace contract
    const Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy();
    await marketplace.deployTransaction.wait(); // Wait for the deployment transaction to be mined

    // Deploy PriceUpdater with Marketplace address
    const PriceUpdater = await ethers.getContractFactory("PriceUpdater");
    priceUpdater = await PriceUpdater.deploy(marketplace.address);  // Initialize `priceUpdater`
    await priceUpdater.deployTransaction.wait(); // Wait for the deployment transaction to be mined
  });

  it("Should properly deploy PriceUpdater and interact with Marketplace", async function () {
    expect(priceUpdater).to.not.be.undefined;
    expect(await priceUpdater.marketplace()).to.equal(marketplace.address);
  });

  it("Should correctly check if upkeep is needed", async function () {
    // Set up for checkUpkeep test
    await marketplace.updatePrice(); // Ensure lastUpdateTime is updated
    const { upkeepNeeded } = await priceUpdater.checkUpkeep([]);
    expect(upkeepNeeded).to.be.false; // Initial condition should not need upkeep

    // Simulate passage of time and check upkeep again
    await ethers.provider.send("evm_increaseTime", [3600]); // Advance time by 1 hour
    await ethers.provider.send("evm_mine"); // Mine a new block

    const { upkeepNeeded: upkeepNeededAfter } = await priceUpdater.checkUpkeep([]);
    expect(upkeepNeededAfter).to.be.true; // Should need upkeep after the interval
  });

  it("Should perform upkeep and update price", async function () {
    // Simulate passage of time to ensure upkeep is needed
    await ethers.provider.send("evm_increaseTime", [3600]); // Advance time by 1 hour
    await ethers.provider.send("evm_mine"); // Mine a new block

    // Perform upkeep
    const updatePriceTx = await priceUpdater.performUpkeep([]);
    await updatePriceTx.wait(); // Wait for the transaction to be mined

    // Check if updatePrice was called on the Marketplace contract
    expect(await marketplace.lastUpdateTime()).to.be.gt(0); // Check if lastUpdateTime is updated
  });
});
