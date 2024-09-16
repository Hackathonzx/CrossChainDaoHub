const hre = require("hardhat");
require('dotenv').config();

async function deployContract(contractName, ...args) {
    const Contract = await hre.ethers.getContractFactory(contractName);
    const contract = await Contract.deploy(...args);
    await contract.waitForDeployment();
    console.log(`${contractName} deployed to:`, await contract.getAddress());
    return contract;
}

async function main() {
    try {
        const [deployer] = await hre.ethers.getSigners();
        console.log("Deploying contracts with the account:", await deployer.getAddress());

        // Load environment variables
        const CCIP_ROUTER_ADDRESS = process.env.CCIP_ROUTER_ADDRESS;
        const LINK_TOKEN_ADDRESS = process.env.LINK_TOKEN_ADDRESS;
        const AVALANCHE_CHAIN_ID = process.env.AVALANCHE_CHAIN_ID;
        const PRICE_FEED_ADDRESS = process.env.PRICE_FEED_ADDRESS;
        const SUBSCRIPTION_ID = process.env.SUBSCRIPTION_ID;
        const ORACLE_ADDRESS = process.env.ORACLE_ADDRESS;

        // Deploy contracts
        const carbonCredit = await deployContract("CarbonCredit");
        const mockOracle = await deployContract("MockOracle", await deployer.getAddress());
        const marketplace = await deployContract("Marketplace", await carbonCredit.getAddress(), PRICE_FEED_ADDRESS, await mockOracle.getAddress());
        const crossChainHandler = await deployContract("CrossChainHandler", await carbonCredit.getAddress(), CCIP_ROUTER_ADDRESS);
        const mockCrossChainHandler = await deployContract("MockCrossChainHandler", await carbonCredit.getAddress());
        const priceUpdater = await deployContract("PriceUpdater", await marketplace.getAddress());

        console.log("CCIP_ROUTER_ADDRESS:", CCIP_ROUTER_ADDRESS);
        console.log("LINK_TOKEN_ADDRESS:", LINK_TOKEN_ADDRESS);
        console.log("PRICE_FEED_ADDRESS:", PRICE_FEED_ADDRESS);


        console.log("All contracts deployed successfully!");
    } catch (error) {
        console.error("Error in deployment:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });