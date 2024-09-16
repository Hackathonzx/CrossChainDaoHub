// Import required modules 
const { ethers } = require("hardhat");

async function main() {
    // Get the deployer's account
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer.address}`);

    // Ensure ethers.utils is available
    if (!ethers.utils) {
        throw new Error('ethers.utils is not available. Check ethers.js version and import.');
    }

    // Example constructor argument for CarbonCredit
    const initialSupply = ethers.parseUnits("1000000", 18); // Adjust as needed

    // Deploy CarbonCredit contract
    const CarbonCredit = await ethers.getContractFactory("CarbonCredit");
    const carbonCredit = await CarbonCredit.deploy(initialSupply);
    await carbonCredit.waitForDeployment();
    console.log("CarbonCredit deployed to:", await carbonCredit.getAddress());

    // Addresses
    const carbonCreditAddress = carbonCredit.getAddress();
    const routerAddress = "0xF694E193200268f9a4868e4Aa017A0118C9a8177"; // Provide the actual router address
    const priceFeedAddress = "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD"; // Provide the actual price feed address
    const mockOracleAddress = "0xd0EbC86a4f67654B654Feb0e615d7f5C139a6406"; // Provide the actual mock oracle address
    const linkAddress = "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846"; // Provide the actual LINK token address

    // Deploy CrossChainHandler contract
    const CrossChainHandler = await ethers.getContractFactory("CrossChainHandler");
    const crossChainHandler = await CrossChainHandler.deploy(carbonCreditAddress, routerAddress);
    await crossChainHandler.waitForDeployment();
    console.log("CrossChainHandler deployed to:", await crossChainHandler.getAddress());

    // Deploy Marketplace contract
    const Marketplace = await ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy(carbonCreditAddress, priceFeedAddress, mockOracleAddress);
    await marketplace.waitForDeployment();
    console.log("Marketplace deployed to:", await marketplace.getAddress());

    // Deploy MockCrossChainHandler contract
    const MockCrossChainHandler = await ethers.getContractFactory("MockCrossChainHandler");
    const mockCrossChainHandler = await MockCrossChainHandler.deploy(carbonCreditAddress);
    await mockCrossChainHandler.waitForDeployment();
    console.log("MockCrossChainHandler deployed to:", await mockCrossChainHandler.getAddress());

    // Deploy MockOracle contract
    const MockOracle = await ethers.getContractFactory("MockOracle");
    const mockOracle = await MockOracle.deploy(linkAddress);
    await mockOracle.waitForDeployment();
    console.log("MockOracle deployed to:", await mockOracle.getAddress());

    // Deploy PriceUpdater contract
    const PriceUpdater = await ethers.getContractFactory("PriceUpdater");
    const priceUpdater = await PriceUpdater.deploy(marketplace.getAddress());
    await priceUpdater.waitForDeployment();
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
