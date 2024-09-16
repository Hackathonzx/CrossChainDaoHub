const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer.address}`);

    // Fetch and log the account balance
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log(`Account balance: ${ethers.formatEther(balance)} AVAX`);

    // Get the network name
    const network = await ethers.provider.getNetwork();
    console.log(`Connected to network: ${network.name}`);

    // 1. Deploy CarbonCredit contract
    const CarbonCredit = await ethers.getContractFactory("CarbonCredit");
    const carbonCredit = await CarbonCredit.deploy();
    await carbonCredit.waitForDeployment();
    const carbonCreditAddress = await carbonCredit.getAddress();
    console.log("CarbonCredit deployed to:", carbonCreditAddress);

    // Addresses for the other contracts
    const routerAddress = "0xF694E193200268f9a4868e4Aa017A0118C9a8177"; // Router address (change to actual one)
    const priceFeedAddress = "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD"; // Price feed address (change to actual one)
    const linkAddress = "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846"; // LINK token address (change to actual one)
    //const carbonCreditAddress = "0xd109932a2C687F259E842CC160F13E14Da27dC01";
    const mockPriceFeedAddress = "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD";
  // const mockOracleAddress = "0x55EB391D80f38F025E67f7506eA91aEBb44F6434";

    // 2. Deploy MockOracle contract (mock version for testing)
    const MockOracle = await ethers.getContractFactory("MockOracle");
    const mockOracle = await MockOracle.deploy(linkAddress);
    await mockOracle.waitForDeployment();
    const mockOracleAddress = await mockOracle.getAddress();
    console.log("MockOracle deployed to:", mockOracleAddress);

    // 3. Deploy CrossChainHandler contract
    const CrossChainHandler = await ethers.getContractFactory("CrossChainHandler");
    const crossChainHandler = await CrossChainHandler.deploy(carbonCreditAddress, routerAddress);
    await crossChainHandler.waitForDeployment();
    console.log("CrossChainHandler deployed to:", await crossChainHandler.getAddress());

    // 4. linktoken
    const LinkToken = await ethers.getContractFactory("LinkToken");
    linkToken = await LinkToken.deploy();
    await linkToken.waitForDeployment();
    console.log("LinkToken deployed to:", await linkToken.getAddress());

//      // 5. Deploy Marketplace
//      const Marketplace = await ethers.getContractFactory("Marketplace");
// const marketplace = await Marketplace.deploy(
//     "0xd109932a2C687F259E842CC160F13E14Da27dC01",
//     "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD",
//     "0x55EB391D80f38F025E67f7506eA91aEBb44F6434"
// );
// await marketplace.deployed();
// console.log("Marketplace deployed to:", marketplace.address);

  // // Additional setup (if needed)
  // // For example, minting some initial carbon credits to the Marketplace contract
  // const initialCredits = hre.ethers.utils.parseEther("1000");  // 1000 credits
  // await carbonCredit.mint(marketplace.address, initialCredits);
  // console.log("Minted initial credits to Marketplace");
 
     //6. Deploy MockCrossChainHandler
     const MockCrossChainHandler = await ethers.getContractFactory("MockCrossChainHandler");
     const mockCrossChainHandler = await MockCrossChainHandler.deploy("0xd109932a2C687F259E842CC160F13E14Da27dC01");
     await mockCrossChainHandler.waitForDeployment();
     console.log("MockCrossChainHandler deployed to:", await mockCrossChainHandler.getAddress());
 
    //  // 7. Deploy PriceUpdater
    //  const PriceUpdater = await ethers.getContractFactory("PriceUpdater");
    //  const priceUpdater = await PriceUpdater.deploy(await marketplace.getAddress());
    //  await priceUpdater.waitForDeployment();
    //  console.log("PriceUpdater deployed to:", await priceUpdater.getAddress());
 
     console.log("All contracts deployed successfully.");
 }

// Run the deployment script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
