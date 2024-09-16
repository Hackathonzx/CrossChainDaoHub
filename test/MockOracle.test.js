const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MockOracle", function () {
  let MockOracle;
  let mockOracle;
  let deployer;

  beforeEach(async function () {
    [deployer] = await ethers.getSigners();

    MockOracle = await ethers.getContractFactory("MockOracle");
    mockOracle = await MockOracle.deploy("0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846");
    await mockOracle.deployTransaction.wait(); // Use deployTransaction.wait() to ensure deployment
  });

  it("Should set the correct LINK token address", async function () {
    const linkAddress = await mockOracle.link();
    expect(linkAddress).to.equal("0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846");
  });

  it("Should return expected data", async function () {
    // Assuming there's a function to get some mock data
    const data = await mockOracle.getData();
    expect(data).to.equal("expected data");
  });
});
