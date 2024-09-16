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
    // Make sure to provide correct parameters here
    carbonCredit = await CarbonCredit.deploy(ethers.parseUnits("1000000", 18));
    await carbonCredit.deployTransaction.wait(); // Use deployTransaction.wait() to ensure deployment
  });

  it("Should set the correct initial supply", async function () {
    const totalSupply = await carbonCredit.totalSupply();
    expect(totalSupply).to.equal(ethers.parseUnits("1000000", 18));
  });

  it("Should assign the initial supply to the deployer", async function () {
    const deployerBalance = await carbonCredit.balanceOf(deployer.address);
    expect(deployerBalance).to.equal(ethers.parseUnits("1000000", 18));
  });

  it("Should mint tokens correctly", async function () {
    await carbonCredit.mint(addr1.address, ethers.parseUnits("100", 18));
    const addr1Balance = await carbonCredit.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(ethers.parseUnits("100", 18));
  });

  it("Should burn tokens correctly", async function () {
    await carbonCredit.burn(ethers.parseUnits("100", 18));
    const deployerBalance = await carbonCredit.balanceOf(deployer.address);
    expect(deployerBalance).to.equal(ethers.parseUnits("999900", 18));
  });
});
