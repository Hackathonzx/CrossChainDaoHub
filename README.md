# Cross-Chain Carbon Credit Marketplace

## Overview
The Cross-Chain Carbon Credit Marketplace is a decentralized platform for trading carbon credits across different blockchains. It leverages Chainlink CCIP for cross-chain communication, Chainlink Price Feeds for real-time pricing, and Chainlink Functions for verification.

## Features
- **Carbon Credit Token (CCT)**: ERC20 token representing carbon credits.
- **Marketplace**: Platform for buying and selling carbon credits.
- **Cross-Chain Transfers**: Handles transfers of carbon credits across different blockchains using Chainlink CCIP.
- **Price Updates**: Uses Chainlink Automation to periodically update carbon credit prices.
- **Testing**: Includes mock contracts and oracles for testing.
- **MockOracle.sol**: Simulates off-chain data retrieval and verification
Stores and provides project data and credit information

## Installation
1. Clone the repository:
    git clone <repository-url>
    cd <repository-directory>

2. Install dependencies:
    npm install

## Configuration
Create a `.env` file in the root directory and add the following environment variables:
```dotenv
CCIP_ROUTER_ADDRESS=0x...
LINK_TOKEN_ADDRESS=0x...
AVALANCHE_CHAIN_ID=43113
PRICE_FEED_ADDRESS=0x...
SUBSCRIPTION_ID=...
ORACLE_ADDRESS=0x...


# Use of Chainlink Services
Chainlink CCIP:
Cross-Chain Functionality: Am using Chainlink CCIP to enable cross-chain transfers of carbon credits, which involves making state changes on the blockchain.
Implementation: I have integrated the CrossChainHandler contract with CCIP to handle cross-chain transfers and mint/burn tokens.
Chainlink Functions:

Verification: You’re using Chainlink Functions to verify carbon credits via an external API. This includes making a state change by calling a function to update the verification status.
Chainlink Price Feeds:

Pricing Mechanism: You are using Chainlink Price Feeds to determine the price of carbon credits, ensuring real-time pricing for transactions.
Chainlink Automation:

Price Updates: You’re leveraging Chainlink Automation (through PriceUpdater) to automatically update the carbon credit price at regular intervals.

State Changes:

Contracts Making State Changes: Your contracts (CrossChainHandler, Marketplace, CarbonCredit) make state changes by minting/burning tokens, updating prices, and verifying credits.
Chainlink Integration:

CCIP: Your CrossChainHandler contract uses Chainlink CCIP to facilitate cross-chain transfers.
Functions: Your Marketplace contract uses Chainlink Functions for verifying carbon credits.
Price Feeds: Your Marketplace contract updates the price of credits using Chainlink Price Feeds.
Automation: The PriceUpdater contract uses Chainlink Automation to manage price updates.