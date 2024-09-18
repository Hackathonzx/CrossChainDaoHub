const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrossChainHandler", function () {
  let deployer, user, recipient, CrossChainHandler, CarbonCredit, crossChainHandler, carbonCredit;
  const CCIP_ROUTER_ADDRESS = "0xF694E193200268f9a4868e4Aa017A0118C9a8177"; // Provided router address
  const destinationChainSelector = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // Example chain selector for testing
  const routerAddress = "0xF694E193200268f9a4868e4Aa017A0118C9a8177";

  beforeEach(async function () {
    [deployer, user, recipient] = await ethers.getSigners();

    // Deploy the CarbonCredit contract
    const CarbonCreditFactory = await ethers.getContractFactory("CarbonCredit");
    carbonCredit = await CarbonCreditFactory.deploy();
    await carbonCredit.deployed();

    // Deploy the CrossChainHandler contract
    const CrossChainHandlerFactory = await ethers.getContractFactory("CrossChainHandler");
    crossChainHandler = await CrossChainHandlerFactory.deploy(carbonCreditAddress, routerAddress);
    await crossChainHandler.waitForDeployment();

    // Mint some CarbonCredit tokens to the user for testing
    await carbonCredit.mint(user.address, ethers.utils.parseUnits("1000", 18)); // 1000 CarbonCredits
  });

  it("should deploy with the correct addresses", async function () {
    expect(await crossChainHandler.carbonCredit()).to.equal(carbonCredit.address);
  });

  it("should allow the owner to whitelist a chain", async function () {
    await crossChainHandler.whitelistChain(destinationChainSelector);
    expect(await crossChainHandler.whitelistedChains(destinationChainSelector)).to.be.true;
  });

  it("should allow cross-chain carbon credit transfer", async function () {
    // Whitelist the destination chain first
    await crossChainHandler.whitelistChain(destinationChainSelector);

    // Approve the CrossChainHandler to spend user's CarbonCredit
    const amountToTransfer = ethers.utils.parseUnits("100", 18); // 100 CarbonCredits
    await carbonCredit.connect(user).approve(crossChainHandlerAddress, amountToTransfer);

    // Check user's initial CarbonCredit balance
    const initialUserBalance = await carbonCredit.balanceOf(user.address);
    expect(initialUserBalance).to.equal(ethers.utils.parseUnits("1000", 18));

    // Initiate a cross-chain carbon credit transfer
    await expect(
      crossChainHandler.connect(user).transferCarbonCreditCrossChain(
        destinationChainSelector,
        recipient.address,
        amountToTransfer,
        { value: ethers.utils.parseEther("0.01") } // Mock fee for the cross-chain transfer
      )
    ).to.emit(crossChainHandler, "CrossChainTransferInitiated")
      .withArgs(user.address, destinationChainSelector, recipient.address, amountToTransfer);

    // User's balance should be reduced by the transferred amount (burned locally)
    const finalUserBalance = await carbonCredit.balanceOf(user.address);
    expect(finalUserBalance).to.equal(initialUserBalance.sub(amountToTransfer));
  });

  it("should mint carbon credits on receiving a cross-chain transfer", async function () {
    // Simulate receiving a cross-chain transfer on this chain
    const amountReceived = ethers.utils.parseUnits("50", 18); // 50 CarbonCredits

    const message = {
      sourceChainSelector: destinationChainSelector, // Assume transfer is coming from the same test chain selector
      data: ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "uint256"],
        [user.address, recipient.address, amountReceived]
      )
    };

    // Call the _ccipReceive function with the simulated cross-chain message
    await crossChainHandler.connect(deployer)._ccipReceive(message);

    // Check that the recipient's balance has been credited with the received amount
    const recipientBalance = await carbonCredit.balanceOf(recipient.address);
    expect(recipientBalance).to.equal(amountReceived);
  });
});
