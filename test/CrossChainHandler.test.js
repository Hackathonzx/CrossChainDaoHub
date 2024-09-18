const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrossChainHandler Contract", function () {
  let crossChainHandler;
  let carbonCredit;
  let owner, addr1;
  const CHAIN_SELECTOR = 1n; // Example chain selector
  const CCIP_ROUTER_ADDRESS = "0xF694E193200268f9a4868e4Aa017A0118C9a8177";

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    // Deploy CarbonCredit contract
    const CarbonCredit = await ethers.getContractFactory("CarbonCredit");
    carbonCredit = await CarbonCredit.deploy();

    // Deploy CrossChainHandler contract
    const CrossChainHandler = await ethers.getContractFactory("CrossChainHandler");
    crossChainHandler = await CrossChainHandler.deploy(await carbonCredit.getAddress(), CCIP_ROUTER_ADDRESS);

    // Set up initial state
    await carbonCredit.mint(owner.address, ethers.parseEther("1000"));
    await carbonCredit.approve(await crossChainHandler.getAddress(), ethers.parseEther("1000"));
    await crossChainHandler.whitelistChain(CHAIN_SELECTOR);
  });

  it("Should set the correct CarbonCredit address", async function () {
    expect(await crossChainHandler.carbonCredit()).to.equal(await carbonCredit.getAddress());
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

    // Approve the CrossChainHandler to burn tokens on behalf of the owner
    await carbonCredit.connect(owner).approve(crossChainHandler.getAddress(), amount);

    await expect(crossChainHandler.transferCarbonCreditCrossChain(CHAIN_SELECTOR, addr1.address, amount, { value: feeAmount }))
      .to.emit(crossChainHandler, "CrossChainTransferInitiated")
      .withArgs(owner.address, CHAIN_SELECTOR, addr1.address, amount);

    // Check if tokens were burned
    expect(await carbonCredit.balanceOf(owner.address)).to.equal(ethers.parseEther("900"));
  });
});