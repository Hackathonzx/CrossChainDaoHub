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

    // // 1. Deploy CarbonCredit contract
    // const CarbonCredit = await ethers.getContractFactory("CarbonCredit");
    // const carbonCredit = await CarbonCredit.deploy();
    // await carbonCredit.waitForDeployment();
    // const carbonCreditAddress = await carbonCredit.getAddress();
    // console.log("CarbonCredit deployed to:", carbonCreditAddress);

    // Addresses for the other contracts
    const routerAddress = "0xF694E193200268f9a4868e4Aa017A0118C9a8177"; // Router address (change to actual one)
    const priceFeedAddress = "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD"; // Price feed address (change to actual one)
    const linkAddress = "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846"; // LINK token address (change to actual one)
    //const carbonCreditAddress = "0xd109932a2C687F259E842CC160F13E14Da27dC01";
    const mockPriceFeedAddress = "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD";
  // const mockOracleAddress = "0x55EB391D80f38F025E67f7506eA91aEBb44F6434";

    // // 2. Deploy MockOracle contract (mock version for testing)
    // const MockOracle = await ethers.getContractFactory("MockOracle");
    // const mockOracle = await MockOracle.deploy(linkAddress);
    // await mockOracle.waitForDeployment();
    // const mockOracleAddress = await mockOracle.getAddress();
    // console.log("MockOracle deployed to:", mockOracleAddress);

    // // 3. Deploy CrossChainHandler contract
    // const CrossChainHandler = await ethers.getContractFactory("CrossChainHandler");
    // const crossChainHandler = await CrossChainHandler.deploy(carbonCreditAddress, routerAddress);
    // await crossChainHandler.waitForDeployment();
    // console.log("CrossChainHandler deployed to:", await crossChainHandler.getAddress());

    // // 4. linktoken
    // const LinkToken = await ethers.getContractFactory("LinkToken");
    // linkToken = await LinkToken.deploy();
    // await linkToken.waitForDeployment();
    // console.log("LinkToken deployed to:", await linkToken.getAddress());


    //  // 5. Deploy MockCrossChainHandler
    //  const MockCrossChainHandler = await ethers.getContractFactory("MockCrossChainHandler");
    //  const mockCrossChainHandler = await MockCrossChainHandler.deploy("0xd109932a2C687F259E842CC160F13E14Da27dC01");
    //  await mockCrossChainHandler.waitForDeployment();
    //  console.log("MockCrossChainHandler deployed to:", await mockCrossChainHandler.getAddress());

     // 6. Deploy Marketplace
     console.log("Starting deployment...");
     console.log("Deploying contracts with the account:", deployer.address);
   
     try {
       const balance = await hre.ethers.provider.getBalance(deployer.address);
       console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
     } catch (error) {
       console.log("Failed to get account balance:", error.message);
     }
   
     // Deploy Marketplace
     console.log("Deploying Marketplace...");
     const Marketplace = await hre.ethers.getContractFactory("Marketplace");
     const carbonCreditAddress = "0xd109932a2C687F259E842CC160F13E14Da27dC01";
     // const priceFeedAddress = "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD";
     const mockOracleAddress = "0x55EB391D80f38F025E67f7506eA91aEBb44F6434";
   
     console.log("Deploying with addresses:", carbonCreditAddress, priceFeedAddress, mockOracleAddress);
   
     const marketplace = await Marketplace.deploy(
       carbonCreditAddress,
       priceFeedAddress,
       mockOracleAddress,
       { gasLimit: 5000000 }
     );
   
     await marketplace.waitForDeployment();
     const marketplaceAddress = await marketplace.getAddress();
     console.log("Marketplace deployed to:", marketplaceAddress);
   
     // Deploy PriceUpdater
     console.log("Deploying PriceUpdater...");
     const PriceUpdater = await hre.ethers.getContractFactory("PriceUpdater");
     const priceUpdater = await PriceUpdater.deploy(marketplaceAddress("0x9e81F1375410AcD4141029f128Eef26C12F445De"));
     await priceUpdater.waitForDeployment();
     const priceUpdaterAddress = await priceUpdater.getAddress();
     console.log("PriceUpdater deployed to:", priceUpdaterAddress);
 
     console.log("All contracts deployed successfully.");
 }

// Run the deployment script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
