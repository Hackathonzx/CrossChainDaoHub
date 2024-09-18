const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Carbon Credit System", function () {
  let CarbonCredit, Marketplace, PriceUpdater;
  let carbonCredit, marketplace, priceUpdater;
  let owner, addr1, addr2;

  const CCIP_ROUTER_ADDRESS = "0xF694E193200268f9a4868e4Aa017A0118C9a8177";
  const LINK_TOKEN_ADDRESS = "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846";
  const PRICE_FEED_ADDRESS = "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD";
  const ORACLE_ADDRESS = "0xd0EbC86a4f67654B654Feb0e615d7f5C139a6406";

  before(async function() {
    console.log("PRICE_FEED_ADDRESS:", PRICE_FEED_ADDRESS);
    console.log("ORACLE_ADDRESS:", ORACLE_ADDRESS);
  });

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    try {
      // Deploy CarbonCredit
      CarbonCredit = await ethers.getContractFactory("CarbonCredit");
      carbonCredit = await CarbonCredit.deploy();
      await carbonCredit.waitForDeployment();
      console.log("CarbonCredit deployed at:", carbonCredit.address);

      // Deploy Marketplace
      Marketplace = await ethers.getContractFactory("Marketplace");
      marketplace = await Marketplace.deploy(
        carbonCredit.address,
        PRICE_FEED_ADDRESS,
        ORACLE_ADDRESS
      );
      await marketplace.deployed();
      console.log("Marketplace deployed at:", marketplace.address);

      // Deploy PriceUpdater
      PriceUpdater = await ethers.getContractFactory("PriceUpdater");
      priceUpdater = await PriceUpdater.deploy(marketplace.address);
      await priceUpdater.deployed();
      console.log("PriceUpdater deployed at:", priceUpdater.address);

      // Mint some carbon credits to the marketplace
      await carbonCredit.mint(marketplace.address, 1000);
      console.log("Minted 1000 credits to Marketplace");
    } catch (error) {
      console.error("Error in beforeEach:", error);
      throw error;
    }
  });

  describe("Marketplace", function () {
    it("Should set the correct initial values", async function () {
      expect(await marketplace.carbonCredit()).to.equal(carbonCredit.address);
      expect(await marketplace.mockOracle()).to.equal(ORACLE_ADDRESS);
    });

    it("Should allow buying carbon credits", async function () {
      const buyAmount = 10;
      const projectId = 1;

      try {
        // Update price first
        await marketplace.updatePrice();
        console.log("Price updated");

        // Verify carbon credits
        await marketplace.verifyCarbonCredit(projectId);
        console.log("Carbon credits verified");
        
        // Get latest price
        const price = await marketplace.getLatestPrice();
        console.log("Latest price:", price.toString());

        // Buy credits
        await marketplace.connect(addr1).buyCredits(buyAmount, projectId, { value: price.mul(buyAmount) });
        console.log("Credits bought");

        const balance = await carbonCredit.balanceOf(addr1.address);
        console.log("Buyer balance:", balance.toString());
        expect(balance).to.equal(buyAmount);
      } catch (error) {
        console.error("Error in buying credits:", error);
        throw error;
      }
    });
  });

  describe("PriceUpdater", function () {
    it("Should deploy PriceUpdater and set the Marketplace address correctly", async function () {
      expect(await priceUpdater.marketplace()).to.equal(marketplace.address);
    });

    it("Should return correct upkeep needed status", async function () {
      try {
        // First, update the price to set lastUpdateTime
        await marketplace.updatePrice();
        console.log("Price updated for upkeep test");

        // Fast forward time by more than UPDATE_INTERVAL
        await ethers.provider.send("evm_increaseTime", [3601]); // 1 hour + 1 second
        await ethers.provider.send("evm_mine");
        console.log("Time fast-forwarded");

        const [upkeepNeeded, ] = await priceUpdater.checkUpkeep("0x");
        console.log("Upkeep needed:", upkeepNeeded);
        expect(upkeepNeeded).to.be.true;
      } catch (error) {
        console.error("Error in upkeep test:", error);
        throw error;
      }
    });
  });
});