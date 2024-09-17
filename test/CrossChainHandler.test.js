const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrossChainHandler Contract", function () {
  let crossChainHandler;
  let carbonCredit;
  let owner, addr1;
  let routerAddress;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    // Deploy CarbonCredit contract
    const CarbonCredit = await ethers.getContractFactory("CarbonCredit");
    carbonCredit = await CarbonCredit.deploy();
    // Wait for the transaction to be mined
    await carbonCredit.deployTransaction.wait();

    // Define routerAddress (mock or real address as needed)
    routerAddress = ethers.constants.AddressZero; // Example placeholder address

    // Deploy CrossChainHandler contract
    const CrossChainHandler = await ethers.getContractFactory("CrossChainHandler");
    crossChainHandler = await CrossChainHandler.deploy(carbonCredit.address, routerAddress);
    // Wait for the transaction to be mined
    await crossChainHandler.deployTransaction.wait();
  });

  it("Should set the correct CarbonCredit address", async function () {
    expect(await crossChainHandler.carbonCredit()).to.equal(carbonCredit.address);
  });

  it("Should allow the owner to whitelist a chain", async function () {
    const chainSelector = 1; // Example chain selector
    await crossChainHandler.whitelistChain(chainSelector);
    expect(await crossChainHandler.whitelistedChains(chainSelector)).to.be.true;
  });

  it("Should not allow non-owners to whitelist a chain", async function () {
    const chainSelector = 2; // Example chain selector
    await expect(crossChainHandler.connect(addr1).whitelistChain(chainSelector))
      .to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should emit CrossChainTransferInitiated event when transferring", async function () {
    const chainSelector = 1;
    const amount = ethers.utils.parseEther("1");
    
    // Whitelist the chain first
    await crossChainHandler.whitelistChain(chainSelector);
    
    // Mint some tokens to the owner for transfer
    await carbonCredit.mint(owner.address, amount);
    
    // Approve CrossChainHandler to spend tokens
    await carbonCredit.approve(crossChainHandler.address, amount);

    await expect(crossChainHandler.transferCarbonCreditCrossChain(chainSelector, addr1.address, amount, { value: ethers.utils.parseEther("0.1") }))
      .to.emit(crossChainHandler, "CrossChainTransferInitiated")
      .withArgs(owner.address, chainSelector, addr1.address, amount);
  });

  // Add more tests as needed
});