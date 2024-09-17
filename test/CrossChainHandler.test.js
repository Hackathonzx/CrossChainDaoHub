const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrossChainHandler Contract", function () {
  let crossChainHandler;
  let carbonCredit;
  let owner, addr1, addr2;
  let routerAddress = "0xF694E193200268f9a4868e4Aa017A0118C9a8177"; // Your router addressgit 

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const CarbonCredit = await ethers.getContractFactory("CarbonCredit");
    carbonCredit = await CarbonCredit.deploy();

    const CrossChainHandler = await ethers.getContractFactory("CrossChainHandler");
    crossChainHandler = await CrossChainHandler.deploy(carbonCredit.address, routerAddress);
  });

  it("Should set the correct CarbonCredit address", async function () {
    expect(await crossChainHandler.carbonCredit()).to.equal(carbonCredit.address);
  });

  it("Should allow the owner to whitelist chains", async function () {
    await crossChainHandler.whitelistChain(1);
    expect(await crossChainHandler.whitelistedChains(1)).to.be.true;
  });

  it("Should not allow non-owner to whitelist chains", async function () {
    await expect(crossChainHandler.connect(addr1).whitelistChain(1)).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should initiate cross-chain transfer", async function () {
    await carbonCredit.mint(addr1.address, 1000);
    await carbonCredit.connect(addr1).approve("0x0cE418fAD30F625A90D82234e9679504216c3eFa", 1000);
    await crossChainHandler.whitelistChain(1);

    await expect(crossChainHandler.connect(addr1).transferCarbonCreditCrossChain(1, addr1.address, 500, { value: ethers.utils.parseEther("0.1") }))
      .to.emit(crossChainHandler, "CrossChainTransferInitiated")
      .withArgs(addr1.address, 1, addr1.address, 500);
  });

  it("Should burn tokens during cross-chain transfer", async function () {
    await carbonCredit.mint(addr1.address, 1000);
    await carbonCredit.connect(addr1).approve("0x0cE418fAD30F625A90D82234e9679504216c3eFa", 1000);
    await crossChainHandler.whitelistChain(1);

    await crossChainHandler.connect(addr1).transferCarbonCreditCrossChain(1, addr1.address, 500, { value: ethers.utils.parseEther("0.1") });

    expect(await carbonCredit.balanceOf(addr1.address)).to.equal(500);
  });
});