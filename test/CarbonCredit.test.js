const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CarbonCredit", function () {
  let CarbonCredit;
  let carbonCredit;
  let deployer;
  let addr1;

  beforeEach(async function () {
    [deployer, addr1] = await ethers.getSigners();

    CarbonCredit = await ethers.getContractFactory("CarbonCredit");
    carbonCredit = await CarbonCredit.deploy();  // No need to call deployed() in ethers v6
  });

  it("Should set the correct initial supply", async function () {
    const totalSupply = await carbonCredit.totalSupply();
    expect(totalSupply).to.equal(0n); // Use 0n for BigInt in ethers v6
  });

  // ... rest of the tests ...
});