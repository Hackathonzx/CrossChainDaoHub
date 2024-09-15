# Sample Hardhat Project

 Use of Chainlink Services
Chainlink CCIP:

Cross-Chain Functionality: You’re using Chainlink CCIP to enable cross-chain transfers of carbon credits, which involves making state changes on the blockchain.
Implementation: You have integrated the CrossChainHandler contract with CCIP to handle cross-chain transfers and mint/burn tokens.
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

Marketplace.sol:

Central contract for buying and selling carbon credits
Integrates with MockOracle for project data and verification
Uses Chainlink Price Feeds for price updates
Interacts with CarbonCredit token


CarbonCredit.sol:

ERC20 token representing carbon credits
Handles minting, burning, and transfers of credits


CrossChainHandler.sol:

Manages cross-chain transfers of carbon credits using Chainlink's CCIP
Interacts with CarbonCredit token for cross-chain operations


MockCrossChainHandler.sol:

Simulates cross-chain transfers for testing and demonstration
Used when actual CCIP implementation is not possible


PriceUpdater.sol:

Implements Chainlink Automation for regular price updates
Calls the updatePrice function in Marketplace contract


MockOracle.sol:

Simulates off-chain data retrieval and verification
Stores and provides project data and credit information
Replaces the need for actual Chainlink Functions in this mock setup