const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrossChainHandler", function () {
  let CrossChainHandler;
  let crossChainHandler;
  let deployer, nonOwner;
  let carbonCreditAddress = "0xd109932a2C687F259E842CC160F13E14Da27dC01";
  let routerAddress = "0xF694E193200268f9a4868e4Aa017A0118C9a8177";

  beforeEach(async function () {
    [deployer, nonOwner] = await ethers.getSigners();

    CrossChainHandler = await ethers.getContractFactory("CrossChainHandler");
    crossChainHandler = await CrossChainHandler.deploy(carbonCreditAddress, routerAddress);
  });

  it("Should set the correct CarbonCredit address", async function () {
    const address = await crossChainHandler.carbonCredit();
    expect(address).to.equal(carbonCreditAddress);
  });

  it("Should set the correct router address", async function () {
    const address = await crossChainHandler.router();
    console.log("Router address:", address); // Debugging log
    expect(address).to.equal(routerAddress);
  });

  it("Should transfer tokens across chains correctly", async function () {
    const recipient = "0x5E5Dcd8Fb53E5C3D8B1CeCE7652d4a74c68E3DC6";
    const amount = ethers.utils.parseUnits("1000", 18);

    // Simulate cross-chain transfer
    await expect(crossChainHandler.transferTokensAcrossChains(recipient, amount))
      .to.emit(crossChainHandler, "TokensTransferred")
      .withArgs(recipient, amount);
  });

  it("Should fail if non-owner tries to initiate a cross-chain transfer", async function () {
    const recipient = "0x5E5Dcd8Fb53E5C3D8B1CeCE7652d4a74c68E3DC6";
    const amount = ethers.utils.parseUnits("1000", 18);

    await expect(
      crossChainHandler.connect(nonOwner).transferTokensAcrossChains(recipient, amount)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should update the CarbonCredit address by the owner", async function () {
    const newCarbonCreditAddress = "0x1234567890abcdef1234567890abcdef12345678";
    await crossChainHandler.updateCarbonCreditAddress(newCarbonCreditAddress);

    const updatedAddress = await crossChainHandler.carbonCredit();
    expect(updatedAddress).to.equal(newCarbonCreditAddress);
  });

  it("Should fail if non-owner tries to update CarbonCredit address", async function () {
    const newCarbonCreditAddress = "0x1234567890abcdef1234567890abcdef12345678";

    await expect(
      crossChainHandler.connect(nonOwner).updateCarbonCreditAddress(newCarbonCreditAddress)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
