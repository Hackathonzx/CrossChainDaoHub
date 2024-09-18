const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PriceUpdater Contract", function () {
  let priceUpdater, marketplace;
  let owner, seller, buyer;

  beforeEach(async function () {
    [owner, seller, buyer] = await ethers.getSigners();

    // Deploy Marketplace contract
    const MarketplaceFactory = await ethers.getContractFactory("Marketplace");
    marketplace = await MarketplaceFactory.deploy(
      "0xd109932a2C687F259E842CC160F13E14Da27dC01", // Example addresses
      "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD",
      "0x55EB391D80f38F025E67f7506eA91aEBb44F6434"
    );
    await marketplace.deployed();

    // Deploy PriceUpdater contract
    const PriceUpdaterFactory = await ethers.getContractFactory("PriceUpdater");
    priceUpdater = await PriceUpdaterFactory.deploy(marketplace.address);
    await priceUpdater.deployed();
  });

  it("Should deploy PriceUpdater and set the Marketplace address correctly", async function () {
    expect(await priceUpdater.marketplace()).to.equal(marketplace.address);
  });

  it("Should correctly check if upkeep is needed", async function () {
    const { upkeepNeeded } = await priceUpdater.checkUpkeep([]);
    const expected = (await ethers.provider.getBlock('latest')).timestamp >= (await marketplace.lastUpdateTime()) + (await marketplace.UPDATE_INTERVAL());
    expect(upkeepNeeded).to.equal(expected);
  });

  it("Should perform upkeep and update price", async function () {
    // Mocking the updatePrice function for testing
    await marketplace.updatePrice(); // Ensure the price is updated before performing upkeep

    const oldPrice = await marketplace.getLatestPrice();

    // Perform upkeep
    await priceUpdater.performUpkeep([]);

    // Verify that the price has been updated
    const newPrice = await marketplace.getLatestPrice();
    expect(newPrice).to.be.not.equal(oldPrice);
  });
});
