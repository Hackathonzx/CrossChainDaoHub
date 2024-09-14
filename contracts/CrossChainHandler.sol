// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CarbonCredit} from "./CarbonCredit.sol";

contract CrossChainHandler {
    CarbonCredit public carbonCredit;
    IRouterClient public router;

    constructor(address _carbonCreditAddress, address _routerAddress) {
        carbonCredit = CarbonCredit(_carbonCreditAddress);
        router = IRouterClient(_routerAddress);
    }

    function transferCarbonCreditCrossChain(
    uint64 destinationChainSelector,
    address recipient,
    uint256 amount,
    bytes memory payload
) external payable {
    require(recipient != address(0), "Invalid recipient address");
    
    // Burn tokens on the source chain
    carbonCredit.burn(msg.sender, amount);
    
    // Create an empty array for tokenAmounts
    Client.EVMTokenAmount[] memory emptyTokenAmounts = new Client.EVMTokenAmount[](0);
    
    // Create the cross-chain message
    Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
        receiver: abi.encode(recipient), // Encode recipient address
        data: payload, // Any additional data to send cross-chain
        tokenAmounts: emptyTokenAmounts, // Empty array of token amounts
        extraArgs: "", // Additional arguments (if any)
        feeToken: address(0) // No fee token used
    });
    
    // Send the cross-chain message via Chainlink CCIP
    router.ccipSend{value: msg.value}(destinationChainSelector, message);
    }
}