const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CarbonCredit Contract", function () {
  let CarbonCredit, carbonCredit, owner, addr1, addr2;

  beforeEach(async function () {
    CarbonCredit = await ethers.getContractFactory("CarbonCredit");
    [owner, addr1, addr2] = await ethers.getSigners();
    carbonCredit = await CarbonCredit.deploy();
  });

  it("Should set the correct name and symbol", async function () {
    expect(await carbonCredit.name()).to.equal("Carbon Credit Token");
    expect(await carbonCredit.symbol()).to.equal("CCT");
  });

  it("Should set the correct initial supply", async function () {
    expect(await carbonCredit.totalSupply()).to.equal(0);
  });

  it("Should allow the owner to mint tokens", async function () {
    await carbonCredit.mint(addr1.address, 100);
    expect(await carbonCredit.balanceOf(addr1.address)).to.equal(100);
  });

  it("Should not allow non-owners to mint tokens", async function () {
    await expect(carbonCredit.connect(addr1).mint(addr2.address, 100)).to.be.revertedWithCustomError(carbonCredit, "OwnableUnauthorizedAccount");
  });

  it("Should allow burning tokens by the owner", async function () {
    await carbonCredit.mint(addr1.address, 100);
    await carbonCredit.burn(addr1.address, 50);
    expect(await carbonCredit.balanceOf(addr1.address)).to.equal(50);
  });

  it("Should allow self-burning of tokens", async function () {
    await carbonCredit.mint(addr1.address, 100);
    await carbonCredit.connect(addr1).burn(addr1.address, 50);
    expect(await carbonCredit.balanceOf(addr1.address)).to.equal(50);
  });

  it("Should allow approved spender to burn tokens", async function () {
    await carbonCredit.mint(addr1.address, 100);
    await carbonCredit.connect(addr1).approve(addr2.address, 50);
    await carbonCredit.connect(addr2).burn(addr1.address, 50);
    expect(await carbonCredit.balanceOf(addr1.address)).to.equal(50);
  });

  it("Should not allow unauthorized burning of tokens", async function () {
    await carbonCredit.mint(addr1.address, 100);
    await expect(carbonCredit.connect(addr2).burn(addr1.address, 50)).to.be.revertedWith("ERC20: burn amount exceeds allowance");
  });

  it("Should not exceed max supply", async function () {
    const maxSupply = await carbonCredit.MAX_SUPPLY();
    await expect(carbonCredit.mint(addr1.address, maxSupply.add(1))).to.be.revertedWith("Max supply exceeded");
  });
});