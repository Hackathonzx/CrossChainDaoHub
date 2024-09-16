const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MockOracle", function () {
  let MockOracle;
  let mockOracle;
  let deployer;
  let linkAddress = "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846";

  beforeEach(async function () {
    [deployer] = await ethers.getSigners();

    MockOracle = await ethers.getContractFactory("MockOracle");
    mockOracle = await MockOracle.deploy(linkAddress);  // No need to call deployed() in ethers v6
  });

  it("Should set the correct LINK token address", async function () {
    const actualLinkAddress = await mockOracle.link();
    expect(actualLinkAddress).to.equal(linkAddress);
  });

  // ... rest of the tests ...
});