const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrossChainHandler", function () {
  let CrossChainHandler;
  let crossChainHandler;
  let deployer;
  let carbonCreditAddress = "0xd109932a2C687F259E842CC160F13E14Da27dC01"; // Replace with actual address
  let routerAddress = "0xF694E193200268f9a4868e4Aa017A0118C9a8177"; // Replace with actual address

  beforeEach(async function () {
    [deployer] = await ethers.getSigners();

    CrossChainHandler = await ethers.getContractFactory("CrossChainHandler");
    crossChainHandler = await CrossChainHandler.deploy(carbonCreditAddress, routerAddress);
    await crossChainHandler.deployTransaction.wait(); // Use deployTransaction.wait() to ensure deployment
  });

  it("Should set the correct CarbonCredit address", async function () {
    const address = await crossChainHandler.carbonCredit();
    expect(address).to.equal(carbonCreditAddress);
  });

  it("Should set the correct router address", async function () {
    const address = await crossChainHandler.router();
    expect(address).to.equal(routerAddress);
  });

  // Add more tests if CrossChainHandler has specific functionalities
});
