// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

contract MockRouter is IRouterClient {
    address public lastSender;
    uint64 public lastDestinationChainSelector;
    Client.EVM2AnyMessage public lastMessage;

    function ccipSend(
        uint64 destinationChainSelector,
        Client.EVM2AnyMessage calldata message
    ) external payable override returns (bytes32) {
        lastSender = msg.sender;
        lastDestinationChainSelector = destinationChainSelector;
        lastMessage = message;
        return bytes32(uint256(1)); // Return a dummy messageId
    }

    function getFee(
        uint64,
        Client.EVM2AnyMessage memory
    ) external pure override returns (uint256 fee) {
        return 0.01 ether;
    }

    function getSupportedTokens(uint64) external pure override returns (address[] memory tokens) {
        tokens = new address[](1);
        tokens[0] = address(0x1234567890123456789012345678901234567890); // Dummy token address
        return tokens;
    }

    function isChainSupported(uint64) external pure override returns (bool supported) {
        return true;
    }

    function mockCcipSend(address expectedSender) external view {
        require(lastSender == expectedSender, "Unexpected sender");
    }
}