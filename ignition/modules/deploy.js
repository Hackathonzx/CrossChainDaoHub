const { ethers } = require("hardhat");
// const { PRICE_FEED_ADDRESS, CCIP_ROUTER_ADDRESS } = process.env
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer.address}`);

    const priceFeedAddress = "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD";
    const routerAddress = "0xF694E193200268f9a4868e4Aa017A0118C9a8177";

   // 1. Deploy CarbonCredit contract
   const CarbonCredit = await ethers.getContractFactory("CarbonCredit");
   const carbonCredit = await CarbonCredit.deploy();
   await carbonCredit.waitForDeployment();
   const carbonCreditAddress = await carbonCredit.getAddress();
   console.log("CarbonCredit deployed to:", carbonCreditAddress);

    // 2. Deploy Marketplace
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(carbonCreditAddress, priceFeedAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("Marketplace deployed to:", marketplaceAddress);

 // 3. Deploy CrossChainHandler contract
  const CrossChainHandler = await ethers.getContractFactory("CrossChainHandler");
  const crossChainHandler = await CrossChainHandler.deploy(carbonCreditAddress, routerAddress);
  await crossChainHandler.waitForDeployment();
  console.log("CrossChainHandler deployed to:", await crossChainHandler.getAddress());
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
