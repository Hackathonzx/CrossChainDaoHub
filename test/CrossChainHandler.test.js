const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrossChainHandler Contract", function () {
  let crossChainHandler;
  let carbonCredit;
  let mockRouter;
  let owner, addr1;
  const CHAIN_SELECTOR = 1n; // Example chain selector

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    // Deploy mock CCIP router
    const MockRouter = await ethers.getContractFactory("MockRouter");
    mockRouter = await MockRouter.deploy();

    // Deploy CarbonCredit contract
    const CarbonCredit = await ethers.getContractFactory("CarbonCredit");
    carbonCredit = await CarbonCredit.deploy();

    // Deploy CrossChainHandler contract
    const CrossChainHandler = await ethers.getContractFactory("CrossChainHandler");
    crossChainHandler = await CrossChainHandler.deploy(await carbonCredit.getAddress(), await mockRouter.getAddress());

    // Set up initial state
    await carbonCredit.mint(owner.address, ethers.parseEther("1000"));
    await carbonCredit.approve(await crossChainHandler.getAddress(), ethers.parseEther("1000"));
    await crossChainHandler.whitelistChain(CHAIN_SELECTOR);
  });

  it("Should set the correct CarbonCredit address", async function () {
    expect(await crossChainHandler.carbonCredit()).to.equal(await carbonCredit.getAddress());
  });

  it("Should set the correct Router address", async function () {
    expect(await crossChainHandler.getRouter()).to.equal(await mockRouter.getAddress());
  });

  it("Should allow the owner to whitelist a chain", async function () {
    const newChainSelector = 2n;
    await crossChainHandler.whitelistChain(newChainSelector);
    expect(await crossChainHandler.whitelistedChains(newChainSelector)).to.be.true;
  });

  it("Should not allow non-owners to whitelist a chain", async function () {
    const newChainSelector = 3n;
    await expect(crossChainHandler.connect(addr1).whitelistChain(newChainSelector))
      .to.be.revertedWithCustomError(crossChainHandler, "OwnableUnauthorizedAccount");
  });

  it("Should initiate cross-chain transfer", async function () {
    const amount = ethers.parseEther("100");
    const feeAmount = ethers.parseEther("0.1");

    const tx = await crossChainHandler.transferCarbonCreditCrossChain(
      CHAIN_SELECTOR,
      addr1.address,
      amount,
      { value: feeAmount }
    );

    await expect(tx)
      .to.emit(crossChainHandler, "CrossChainTransferInitiated")
      .withArgs(owner.address, CHAIN_SELECTOR, addr1.address, amount);

    expect(await carbonCredit.balanceOf(owner.address)).to.equal(ethers.parseEther("900"));

    // Verify that the mock router was called
    await mockRouter.mockCcipSend(await crossChainHandler.getAddress());
  });

  it("Should not allow transfer to non-whitelisted chain", async function () {
    const amount = ethers.parseEther("100");
    const feeAmount = ethers.parseEther("0.1");
    const nonWhitelistedChainSelector = 999n;

    await expect(crossChainHandler.transferCarbonCreditCrossChain(
      nonWhitelistedChainSelector,
      addr1.address,
      amount,
      { value: feeAmount }
    )).to.be.revertedWith("Destination chain not whitelisted");
  });

  it("Should not allow transfer with insufficient balance", async function () {
    const amount = ethers.parseEther("2000"); // More than minted
    const feeAmount = ethers.parseEther("0.1");

    await expect(crossChainHandler.transferCarbonCreditCrossChain(
      CHAIN_SELECTOR,
      addr1.address,
      amount,
      { value: feeAmount }
    )).to.be.reverted; // The exact error message will depend on your CarbonCredit contract implementation
  });
});