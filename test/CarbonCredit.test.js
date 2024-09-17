const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CarbonCredit Contract", function () {
  let carbonCredit;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const CarbonCredit = await ethers.getContractFactory("CarbonCredit");
    carbonCredit = await CarbonCredit.deploy();
  });

  it("Should set the correct initial supply", async function () {
    const totalSupply = await carbonCredit.totalSupply();
    expect(totalSupply).to.equal(0);
  });

  it("Should allow the owner to mint tokens", async function () {
    await carbonCredit.mint(addr1.address, 1000);
    expect(await carbonCredit.balanceOf(addr1.address)).to.equal(1000);
  });

  it("Should not allow non-owners to mint tokens", async function () {
    await expect(carbonCredit.connect(addr1).mint(addr1.address, 1000))
      .to.be.revertedWithCustomError(carbonCredit, "OwnableUnauthorizedAccount");
  });

  it("Should allow burning tokens by the owner", async function () {
    await carbonCredit.mint(addr1.address, 1000);
    await carbonCredit.burn(addr1.address, 500);
    expect(await carbonCredit.balanceOf(addr1.address)).to.equal(500);
  });

  it("Should allow self-burning of tokens", async function () {
    await carbonCredit.mint(addr1.address, 1000);
    await carbonCredit.connect(addr1).burn(addr1.address, 500);
    expect(await carbonCredit.balanceOf(addr1.address)).to.equal(500);
  });

  it("Should not allow unauthorized burning of tokens", async function () {
    await carbonCredit.mint(addr1.address, 1000);
    await expect(carbonCredit.connect(addr2).burn(addr1.address, 500))
      .to.be.revertedWith("Not authorized to burn");
  });
});