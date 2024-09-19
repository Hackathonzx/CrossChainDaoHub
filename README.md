**Cross-Chain Carbon Credit Marketplace**

**1. Architecture Overview**
- Project Description
The Cross-Chain Carbon Credit Marketplace is a decentralized platform designed for the buying, selling, and trading of carbon credits across multiple blockchains. By leveraging Chainlink services, including CCIP, Price Feeds, and Automation, this project aims to create a transparent, secure, and efficient marketplace for carbon credits.

- Solution Architecture
Blockchain Choice: Avalanche for its high throughput, low transaction costs, and EVM compatibility.
Cross-Chain Communication: Chainlink CCIP (Cross-Chain Interoperability Protocol) for seamless interaction between different blockchains.
Price Feeds: Chainlink Price Feeds for real-time carbon credit pricing.
Smart Contracts: A suite of smart contracts to manage carbon credits, facilitate cross-chain transactions, and update prices.

2. **Chainlink Integration**
- State Changes
All Chainlink services are integrated into the smart contracts to ensure state changes, fulfilling the requirement of using Chainlink within smart contracts.

- Meaningful Combination
This project utilizes a combination of Chainlink services: CCIP, Price Feeds, and Functions, showcasing a meaningful and comprehensive use of Chainlink tools.

3. **Installation and Setup**
- Prerequisites
Node.js (v18 or later)
npm or yarn
Hardhat
Metamask or another Web3 wallet

- Installation Steps
Clone the Repository: git clone https://github.com/your-username/cross-chain-carbon-credit-marketplace.git
cd cross-chain-carbon-credit-marketplace

- Install Dependencies
npm install
Create a .env File Add the following environment variables to your .env file:

CCIP_ROUTER_ADDRESS=0xF694E193200268f9a4868e4Aa017A0118C9a8177
LINK_TOKEN_ADDRESS=0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846
AVALANCHE_URL=https://subnets.avax.network/pearl/testnet/rpc
AVALANCHE_CHAIN_ID=1612
PRICE_FEED_ADDRESS=0x5498BB86BC934c8D34FDA08E81D444153d0D06aD
ORACLE_ADDRESS=0x022EEA14A6010167ca026B32576D6686dD7e85d2
SUBSCRIPTION_ID=12407
Avalanche_Fuji=0x022EEA14A6010167ca026B32576D6686dD7e85d2
JOB_ID=8ced832954544a3c98543c94a51d6a8d
Avalanche_chain_selector=14767482510784806043

- Compile Contracts: npx hardhat compile
- Deploy Contracts: npx hardhat run ignition/modules/deploy.js --network IntersectTestnet
- Deployment Addresses:

CarbonCredit deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Marketplace deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
CrossChainHandler deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

- Run Tests: npx hardhat test
- 
4. **Smart Contract Descriptions**
- CarbonCredit.sol
Description: ERC20 token contract for Carbon Credit Tokens (CCT). Manages minting and burning of tokens.
Key Functions:
       - mint(address to, uint256 amount): Mints new CCT tokens.
       - burn(address from, uint256 amount): Burns CCT tokens.
- Marketplace.sol
Description: Manages the marketplace for buying and selling carbon credits. Integrates Chainlink Price Feeds for real-time pricing.
Key Functions:
       -  listCredit(address seller, uint256 amount, uint256 price): Lists carbon credits for sale.
       - buyCredit(address seller, uint256 amount): Buys listed carbon credits.
- CrossChainHandler.sol
Description: Handles cross-chain transactions for carbon credits using Chainlink CCIP.
Key Functions: transferCredit(address from, address to, uint256 amount): Initiates a cross-chain transfer of carbon credits.

5. **Cross-Chain Messaging with Chainlink CCIP**
- Overview
Chainlink CCIP enables communication and transactions between different blockchains. In this project, it facilitates the transfer of carbon credits across multiple chains.
- Implementation
Contract: CrossChainHandler.sol
Chainlink Services: Utilizes CCIP for initiating and verifying cross-chain transactions.
- Setup
Deploy Chainlink CCIP Router: Ensure the CCIP Router address is set up in the .env file.
Configure Cross-Chain Handlers: Deploy CrossChainHandler.sol with the appropriate CCIP Router address.

6. **Usage Instructions**
- Interacting with the Marketplace
Listing Carbon Credits: Use the listCredit function to list your carbon credits for sale.
Purchasing Carbon Credits: Use the buyCredit function to purchase listed carbon credits.
Cross-Chain Transfers
Initiate Transfer: Use the transferCredit function in CrossChainHandler.sol to initiate a cross-chain transfer of carbon credits.
Price Updates
Update Prices: The PriceUpdater contract automatically updates prices at regular intervals.

**License**
This project is open-source and licensed under the MIT License. Feel free to use, modify, and distribute the code as per the license terms.
