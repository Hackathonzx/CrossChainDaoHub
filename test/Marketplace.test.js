const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace Contract", function () {
  let marketplace, carbonCredit, mockOracle, mockPriceFeed;
  let owner, seller, buyer;
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

  before(async function () {
    // Deploy the MockPriceFeed contract
    const MockPriceFeed = await ethers.getContractFactory("MockPriceFeed");
    mockPriceFeed = await MockPriceFeed.deploy();
    await mockPriceFeed.waitForDeployment();
  });

  beforeEach(async function () {
    [owner, seller, buyer] = await ethers.getSigners();

    // Deploy CarbonCredit contract
    const CarbonCredit = await ethers.getContractFactory("CarbonCredit");
    carbonCredit = await CarbonCredit.deploy();

    // Deploy MockOracle contract
    const MockOracle = await ethers.getContractFactory("MockOracle");
    mockOracle = await MockOracle.deploy(ZERO_ADDRESS); // Pass a dummy LINK address

    // Deploy Marketplace contract
    const Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy(
      await carbonCredit.getAddress(),
      await mockPriceFeed.getAddress(),
      await mockOracle.getAddress()
    );

    // Mint tokens for seller
    await carbonCredit.mint(seller.address, ethers.parseEther("1000"));
    await carbonCredit.connect(seller).approve(await marketplace.getAddress(), ethers.parseEther("1000"));

    // Set initial price in the mock price feed
    await mockPriceFeed.setPrice(ethers.parseEther("100")); // 100 ETH per credit

    // Update price in the marketplace
    await marketplace.updatePrice();
  });

  it("Should allow buying carbon credits", async function () {
    const amount = ethers.parseEther("10");
    const projectId = 1;
    const price = await marketplace.getLatestPrice();
    const cost = amount * price / ethers.parseEther("1");

    // Mock the oracle response
    await mockOracle.setProjectData(projectId, "Test Project", "Description", 100, 1000);

    // Buy credits
    await expect(marketplace.connect(buyer).buyCredits(amount, projectId, { value: cost }))
      .to.emit(marketplace, "CreditsPurchased")
      .withArgs(buyer.address, amount, cost);

    // Check balance
    expect(await carbonCredit.balanceOf(buyer.address)).to.equal(amount);
  });

  it("Should allow selling carbon credits", async function () {
    const amount = ethers.parseEther("10");
    const projectId = 1;
    const price = await marketplace.getLatestPrice();
    const payment = amount * price / ethers.parseEther("1");

    // Mint credits for seller
    await carbonCredit.mint(seller.address, amount);
    await carbonCredit.connect(seller).approve(await marketplace.getAddress(), amount);

    // Mock the oracle response
    await mockOracle.setProjectData(projectId, "Test Project", "Description", 100, 1000);

    // Seller balance before
    const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);

    // Sell credits
    await expect(marketplace.connect(seller).sellCredits(amount, projectId))
      .to.emit(marketplace, "CreditsSold")
      .withArgs(seller.address, amount, payment);

    // Check balances
    expect(await carbonCredit.balanceOf(seller.address)).to.equal(0);
    expect(await carbonCredit.balanceOf(await marketplace.getAddress())).to.equal(amount);

    // Check seller received payment
    const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
    expect(sellerBalanceAfter).to.be.gt(sellerBalanceBefore);
  });

  it("Should update price correctly", async function () {
    const newPrice = ethers.parseEther("200"); // 200 ETH per credit
    await mockPriceFeed.setPrice(newPrice);

    await marketplace.updatePrice();

    expect(await marketplace.getLatestPrice()).to.equal(newPrice);
  });

  it("Should verify carbon credits correctly", async function () {
    const projectId = 1;
    await mockOracle.setProjectData(projectId, "Test Project", "Description", 100, 1000);

    const tx = await marketplace.verifyCarbonCredit(projectId);
    const receipt = await tx.wait();

    const verificationEvent = receipt.logs.find(
      log => log.fragment.name === "VerifiedCreditStatus"
    );

    expect(verificationEvent).to.not.be.undefined;
    expect(verificationEvent.args.result).to.equal(ethers.solidityPacked(["string"], ["valid"]));
  });

  it("Should not allow buying unverified credits", async function () {
    const amount = ethers.parseEther("10");
    const projectId = 2; // Assuming this project is not verified
    const price = await marketplace.getLatestPrice();
    const cost = amount * price / ethers.parseEther("1");

    await expect(marketplace.connect(buyer).buyCredits(amount, projectId, { value: cost }))
      .to.be.revertedWith("Carbon credits not verified");
  });

  it("Should allow owner to withdraw funds", async function () {
    const amount = ethers.parseEther("10");
    const projectId = 1;
    const price = await marketplace.getLatestPrice();
    const cost = amount * price / ethers.parseEther("1");

    // Mock the oracle response
    await mockOracle.setProjectData(projectId, "Test Project", "Description", 100, 1000);

    // Buy credits to add funds to the contract
    await marketplace.connect(buyer).buyCredits(amount, projectId, { value: cost });

    const initialBalance = await ethers.provider.getBalance(owner.address);
    await marketplace.connect(owner).withdraw();
    const finalBalance = await ethers.provider.getBalance(owner.address);

    expect(finalBalance).to.be.gt(initialBalance);
  });
});