
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer.address}`);

  // Addresses for the other contracts
  const routerAddress = "0xF694E193200268f9a4868e4Aa017A0118C9a8177"; // Router address (change to actual one)
  const priceFeedAddress = "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD"; // Price feed address (change to actual one)
  const linkAddress = "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846"; // LINK token address (change to actual one)

    // 1. Deploy CarbonCredit contract
    const CarbonCredit = await ethers.getContractFactory("CarbonCredit");
    const carbonCredit = await CarbonCredit.deploy();
    await carbonCredit.waitForDeployment();
    const carbonCreditAddress = await carbonCredit.getAddress();
    console.log("CarbonCredit deployed to:", carbonCreditAddress);

    // 2. linktoken
        const LinkToken = await ethers.getContractFactory("LinkToken");
        linkToken = await LinkToken.deploy();
        await linkToken.waitForDeployment();
        console.log("LinkToken deployed to:", await linkToken.getAddress());

    // 3. Deploy MockOracle contract (mock version for testing)
    const MockOracle = await ethers.getContractFactory("MockOracle");
    const mockOracle = await MockOracle.deploy(linkAddress);
    await mockOracle.waitForDeployment();
    const mockOracleAddress = await mockOracle.getAddress();
    console.log("MockOracle deployed to:", mockOracleAddress);

    // 4. Deploy CrossChainHandler contract
    const CrossChainHandler = await ethers.getContractFactory("CrossChainHandler");
    const crossChainHandler = await CrossChainHandler.deploy(carbonCreditAddress, routerAddress);
    await crossChainHandler.waitForDeployment();
    console.log("CrossChainHandler deployed to:", await crossChainHandler.getAddress());

     // 5. Deploy MockCrossChainHandler
     const MockCrossChainHandler = await ethers.getContractFactory("MockCrossChainHandler");
     const mockCrossChainHandler = await MockCrossChainHandler.deploy(carbonCreditAddress);
     await mockCrossChainHandler.waitForDeployment();
     console.log("MockCrossChainHandler deployed to:", await mockCrossChainHandler.getAddress());

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
   
     //7. Deploy PriceUpdater
     console.log("Deploying PriceUpdater...");
     const PriceUpdater = await hre.ethers.getContractFactory("PriceUpdater");
     const priceUpdater = await PriceUpdater.deploy(marketplaceAddress);
    await priceUpdater.waitForDeployment();
     const priceUpdaterAddress = await priceUpdater.getAddress();
     console.log("PriceUpdater deployed to:", await priceUpdater.getAddress());
 
     console.log("All contracts deployed successfully.");
 }

// Run the deployment script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
