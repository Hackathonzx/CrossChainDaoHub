const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrossChainHandler", function () {
  let deployer, user, recipient, crossChainHandler, carbonCredit, routerClientMock;
  const CCIP_ROUTER_ADDRESS = "0xF694E193200268f9a4868e4Aa017A0118C9a8177"; // Provided router address
  const destinationChainSelector = 1; // Example chain selector for testing
  let carbonCreditAddress;

  beforeEach(async function () {
    [deployer, user, recipient] = await ethers.getSigners();

    // Deploy the CarbonCredit contract
    const CarbonCreditFactory = await ethers.getContractFactory("CarbonCredit");
    carbonCredit = await CarbonCreditFactory.deploy();
    await carbonCredit.waitForDeployment();
    carbonCreditAddress = await carbonCredit.getAddress();

    // Deploy a mock Router Client
    const RouterClientMockFactory = await ethers.getContractFactory("RouterClientMock");
    routerClientMock = await RouterClientMockFactory.deploy();
    await routerClientMock.waitForDeployment();

    // Deploy the CrossChainHandler contract with the mock router
    const CrossChainHandlerFactory = await ethers.getContractFactory("CrossChainHandler");
    crossChainHandler = await CrossChainHandlerFactory.deploy(carbonCreditAddress, routerClientMock.getAddress());
    await crossChainHandler.waitForDeployment();

    // Mint some CarbonCredit tokens to the user for testing
    await carbonCredit.mint(user.address, ethers.parseUnits("1000", 18));
  });

  it("should deploy with the correct addresses", async function () {
    expect(await crossChainHandler.carbonCredit()).to.equal(carbonCreditAddress);
  });

  it("should allow the owner to whitelist a chain", async function () {
    await crossChainHandler.whitelistChain(destinationChainSelector);
    expect(await crossChainHandler.whitelistedChains(destinationChainSelector)).to.be.true;
  });

  it("should allow cross-chain carbon credit transfer", async function () {
    // Whitelist the destination chain first
    await crossChainHandler.whitelistChain(destinationChainSelector);

    // Approve the CrossChainHandler to spend user's CarbonCredit
    const amountToTransfer = ethers.parseUnits("100", 18);
    await carbonCredit.connect(user).approve(crossChainHandler.getAddress(), amountToTransfer);

    // Check user's initial CarbonCredit balance
    const initialUserBalance = await carbonCredit.balanceOf(user.address);
    expect(initialUserBalance).to.equal(ethers.parseUnits("1000", 18));

    // Simulate a cross-chain transfer
    await expect(
      crossChainHandler.connect(user).transferCarbonCreditCrossChain(
        destinationChainSelector,
        recipient.address,
        amountToTransfer,
        { value: ethers.parseEther("0.01") }
      )
    ).to.emit(crossChainHandler, "CrossChainTransferInitiated")
      .withArgs(user.address, destinationChainSelector, recipient.address, amountToTransfer);

    // User's balance should be reduced by the transferred amount (burned locally)
    const finalUserBalance = await carbonCredit.balanceOf(user.address);
    expect(finalUserBalance).to.equal(initialUserBalance.sub(amountToTransfer));
  });

  it("should mint carbon credits on receiving a cross-chain transfer", async function () {
    // Simulate receiving a cross-chain transfer on this chain
    const amountReceived = ethers.parseUnits("50", 18);

    const message = {
      sourceChainSelector: destinationChainSelector,
      data: ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "address", "uint256"],
        [user.address, recipient.address, amountReceived]
      )
    };

    // Use the test utility function to simulate receiving a cross-chain message
    await crossChainHandler.connect(deployer).receiveCrossChainMessage(message);

    // Check that the recipient's balance has been credited with the received amount
    const recipientBalance = await carbonCredit.balanceOf(recipient.address);
    expect(recipientBalance).to.equal(amountReceived);
  });
});
