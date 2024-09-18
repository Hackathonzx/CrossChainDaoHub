const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MockOracle Contract", function () {
  let mockOracle;
  let linkToken;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
  
    // Deploy Mock LINK Token contract
    const LinkTokenFactory = await ethers.getContractFactory("LinkToken");
    linkToken = await LinkTokenFactory.deploy();
    await linkToken.waitForDeployment();  // Ensure deployment completes
  
    // Deploy MockOracle with LinkToken address
    const MockOracleFactory = await ethers.getContractFactory("MockOracle");
    mockOracle = await MockOracleFactory.deploy(linkToken.address);
    await mockOracle.waitForDeployment();  // Ensure deployment completes
  });
  
  it("Should set the correct LINK token address", async function () {
    // The method to get LINK token address should be adjusted according to your contract
    expect(await mockOracle.LINK()).to.equal(linkToken.address);
  });
});
