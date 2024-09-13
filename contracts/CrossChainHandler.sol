// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts-ccip/src/v0.8/ccip/Router.sol";  // Import Chainlink CCIP Router
import "./CarbonCredit.sol";  // Import CarbonCredit contract with burn function

contract CrossChainHandler {
    CarbonCredit public carbonCredit;  // Declare the CarbonCredit contract instance
    IRouter public router;  // Declare the Chainlink CCIP router

    // Constructor to initialize the CarbonCredit contract and CCIP Router
    constructor(address _carbonCreditAddress, address _routerAddress) {
        carbonCredit = CarbonCredit(_carbonCreditAddress);  // Set CarbonCredit address
        router = IRouter(_routerAddress);
    }

    // Function to transfer Carbon Credit tokens cross-chain
    function transferCarbonCreditCrossChain(
        uint64 destinationChainId, 
        address recipient, 
        uint256 amount, 
        bytes memory payload
    ) external payable {
        require(recipient != address(0), "Invalid recipient address");

        // Burn tokens on the source chain
        carbonCredit.burn(msg.sender, amount);  // Calling burn function of CarbonCredit

        // Create the cross-chain message
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(recipient),  // Encode recipient address
            data: payload,  // Any additional data to send cross-chain
            tokenAmounts: new Client.EVMTokenAmount[](),  // Empty array for tokenAmounts
            feeToken: address(0)  // No fee token used
        });

        // Send the cross-chain message via Chainlink CCIP
        router.ccipSend{value: msg.value}(destinationChainId, message);
    }
}
