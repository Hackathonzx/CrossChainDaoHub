const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace Contract", function () {
  let marketplace, carbonCredit, mockOracle;
  let owner, seller, buyer;

  beforeEach(async function () {
    [owner, seller, buyer] = await ethers.getSigners();

    // Deploy CarbonCredit contract
    const CarbonCredit = await ethers.getContractFactory("CarbonCredit");
    carbonCredit = await CarbonCredit.deploy();
    await carbonCredit.waitForDeployment();

    // Deploy MockOracle contract
    const MockOracle = await ethers.getContractFactory("MockOracle");
    mockOracle = await MockOracle.deploy();
    await mockOracle.deployed();

    // Deploy PriceFeed contract
    const PriceFeed = await ethers.getContractFactory("PriceFeed");
    priceFeed = await PriceFeed.deploy();
    await priceFeed.deployed();

    // Deploy Marketplace contract
    const Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy(
      carbonCredit.address,
      priceFeed.address,
      mockOracle.address
    );
    await marketplace.deployed();

    // Mint tokens for seller
    await carbonCredit.mint(seller.address, ethers.utils.parseEther("1000"));
    await carbonCredit.connect(seller).approve(marketplace.address, ethers.utils.parseEther("1000"));
  });

  it("Should allow listing carbon credits", async function () {
    await expect(
      marketplace.connect(seller).listCarbonCredits(ethers.utils.parseEther("100"), ethers.utils.parseEther("1"))
    )
      .to.emit(marketplace, "CarbonCreditsListed")
      .withArgs(seller.address, ethers.utils.parseEther("100"), ethers.utils.parseEther("1"));
  });
});
