const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MockOracle Contract", function () {
  let mockOracle;
  let linkToken;
  let owner, addr1, addr2;

  const linkAddress = "0x8E98a7f5c9BBeA17d80Fc5466ab5760E46433eAC";
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
  
    // Deploy LinkToken contract
    const LinkToken = await ethers.getContractFactory("LinkToken");
    linkToken = await LinkToken.deploy();
    await linkToken.waitForDeployment();  // Ensure deployment completes
  
    // Deploy MockOracle with LinkToken address
    const MockOracle = await ethers.getContractFactory("MockOracle");
    mockOracle = await MockOracle.deploy(linkToken.address);  // Use valid `linkToken.address`
    await mockOracle.waitForDeployment();  // Ensure deployment completes
  });
  

  it("Should set the correct LINK token address", async function () {
    expect(await mockOracle.getChainlinkToken()).to.equal(linkToken.address);
  });
});
