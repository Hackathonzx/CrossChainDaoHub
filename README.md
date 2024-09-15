## Cross-Chain Carbon Credit Marketplace

1. **Architecture Overview**
**Project Description**
The Cross-Chain Carbon Credit Marketplace is a decentralized platform that enables the buying, selling, and trading of carbon credits across multiple blockchains. The system utilizes Chainlink services for cross-chain interoperability, price feeds, and verification of carbon credits. The project aims to create a transparent, secure, and efficient marketplace for carbon credits.

**Solution Architecture**
- **Blockchain Choice**: Avalanche for its high throughput, low transaction costs, and EVM compatibility.
- **Cross-Chain Communication**: Chainlink CCIP (Cross-Chain Interoperability Protocol) for seamless interaction between different blockchains.
- **Price Feeds**: Chainlink Price Feeds for real-time carbon credit pricing.
- **Smart Contracts**: A suite of smart contracts to manage carbon credits, facilitate cross-chain transactions, and update prices.

2. **Installation and Setup**
Prerequisites
Node.js (v18 or later)
npm or yarn
Hardhat
Metamask or another Web3 wallet
Installation Steps
Clone the Repository: git clone https://github.com/your-username/cross-chain-carbon-credit-marketplace.git
cd cross-chain-carbon-credit-marketplace

Install Dependencies: npm install

# Create a .env File 
CPIP_ROUTER_ADDRESS=your_ccip_router_address
LINK_TOKEN_ADDRESS=your_link_token_address
AVALANCHE_CHAIN_ID=your_avalanche_chain_id
PRICE_FEED_ADDRESS=your_price_feed_address
SUBSCRIPTION_ID=your_subscription_id
ORACLE_ADDRESS=your_oracle_address

# Compile Contracts
npx hardhat compile

# Deploy Contracts
npx hardhat run ignition/modules/deploy.js --network IntersectTestnet

# Run Tests
npx hardhat test

3. **Smart Contract Descriptions**
**CarbonCredit.sol**
Description: ERC20 token contract for Carbon Credit Tokens (CCT). Manages minting and burning of tokens.
Key Functions:
mint(address to, uint256 amount): Mints new CCT tokens.
burn(address from, uint256 amount): Burns CCT tokens.
**Marketplace.sol**
Description: Manages the marketplace for buying and selling carbon credits. Integrates Chainlink Price Feeds for real-time pricing.
Key Functions:
listCredit(address seller, uint256 amount, uint256 price): Lists carbon credits for sale.
buyCredit(address seller, uint256 amount): Buys listed carbon credits.
**CrossChainHandler.sol**
Description: Handles cross-chain transactions for carbon credits using Chainlink CCIP.
Key Functions:
transferCredit(address from, address to, uint256 amount): Initiates a cross-chain transfer of carbon credits.
**MockCrossChainHandler.sol**
Description: Simulates cross-chain transfers for testing purposes.
Key Functions:
simulateTransfer(address from, address to, uint256 amount): Simulates a cross-chain transfer.
**MockOracle.sol**
Description: Mock oracle contract for storing and retrieving project information and verifying carbon credits.
Key Functions:
setCreditInfo(address creditAddress, string info): Sets information for a carbon credit.
**PriceUpdater.sol**
Description: Updates the price of carbon credits periodically using Chainlink Automation.
Key Functions:
updatePrice(): Updates the current price of carbon credits.

4. **Cross-Chain Messaging with Chainlink CCIP**
**Overview**
Chainlink CCIP is used to enable communication and transactions between different blockchains. In this project, it allows for the transfer of carbon credits across multiple chains.

**Implementation**
Contract: CrossChainHandler.sol
Chainlink Services: Utilizes CCIP for initiating and verifying cross-chain transactions.

**Setup**
Deploy Chainlink CCIP Router: Ensure the CCIP Router address is set up in the .env file.
Configure Cross-Chain Handlers: Deploy CrossChainHandler.sol with the appropriate CCIP Router address.

5. **Usage Instructions**
Interacting with the Marketplace
Listing Carbon Credits: Use the listCredit function to list your carbon credits for sale.
Purchasing Carbon Credits: Use the buyCredit function to purchase listed carbon credits.
Cross-Chain Transfers
Initiate Transfer: Use the transferCredit function in CrossChainHandler.sol to initiate a cross-chain transfer of carbon credits.
Price Updates
Update Prices: The PriceUpdater contract automatically updates prices at regular intervals.

**License**
This project is open-source and licensed under the MIT License. Feel free to use, modify, and distribute the code as per the license terms.