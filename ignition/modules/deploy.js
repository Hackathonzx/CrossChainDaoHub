const { ethers } = require("hardhat");
require('dotenv').config();

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Load environment variables
    const CCIP_ROUTER_ADDRESS = process.env.CCIP_ROUTER_ADDRESS;
    const LINK_TOKEN_ADDRESS = process.env.LINK_TOKEN_ADDRESS;
    const AVALANCHE_CHAIN_ID = process.env.AVALANCHE_CHAIN_ID;
    const PRICE_FEED_ADDRESS = process.env.PRICE_FEED_ADDRESS;
    const SUBSCRIPTION_ID = process.env.SUBSCRIPTION_ID;
    const ORACLE_ADDRESS = process.env.ORACLE_ADDRESS;

    // Deploy CarbonCredit.sol
    const CarbonCredit = await ethers.getContractFactory("CarbonCredit");
    const carbonCredit = await CarbonCredit.deploy();
    const carbonCreditReceipt = await carbonCredit.deployTransaction.wait(); // Wait for the deployment to be mined
    console.log("CarbonCredit contract deployed at:", carbonCredit.address);

    // Deploy MockOracle.sol
    const MockOracle = await ethers.getContractFactory("MockOracle");
    const mockOracle = await MockOracle.deploy(deployer.address);
    const mockOracleReceipt = await mockOracle.deployTransaction.wait(); // Wait for the deployment to be mined
    console.log("MockOracle contract deployed at:", mockOracle.address);

    // Deploy Marketplace.sol
    const Marketplace = await ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy(carbonCredit.address, PRICE_FEED_ADDRESS, mockOracle.address);
    const marketplaceReceipt = await marketplace.deployTransaction.wait(); // Wait for the deployment to be mined
    console.log("Marketplace contract deployed at:", marketplace.address);

    // Deploy CrossChainHandler.sol
    const CrossChainHandler = await ethers.getContractFactory("CrossChainHandler");
    const crossChainHandler = await CrossChainHandler.deploy(carbonCredit.address, CCIP_ROUTER_ADDRESS);
    const crossChainHandlerReceipt = await crossChainHandler.deployTransaction.wait(); // Wait for the deployment to be mined
    console.log("CrossChainHandler contract deployed at:", crossChainHandler.address);

    // Deploy MockCrossChainHandler.sol
    const MockCrossChainHandler = await ethers.getContractFactory("MockCrossChainHandler");
    const mockCrossChainHandler = await MockCrossChainHandler.deploy(carbonCredit.address);
    const mockCrossChainHandlerReceipt = await mockCrossChainHandler.deployTransaction.wait(); // Wait for the deployment to be mined
    console.log("MockCrossChainHandler contract deployed at:", mockCrossChainHandler.address);

    // Deploy PriceUpdater.sol
    const PriceUpdater = await ethers.getContractFactory("PriceUpdater");
    const priceUpdater = await PriceUpdater.deploy(marketplace.address);
    const priceUpdaterReceipt = await priceUpdater.deployTransaction.wait(); // Wait for the deployment to be mined
    console.log("PriceUpdater contract deployed at:", priceUpdater.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
