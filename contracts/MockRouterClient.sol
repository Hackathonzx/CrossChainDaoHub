// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";

contract MockRouterClient {
    function mockSend(
        uint64 destinationChainSelector,
        bytes memory payload
    ) external {
        // Mock implementation for sending messages
    }

    function mockReceive(
        Client.Any2EVMMessage memory message
    ) external {
        // Mock implementation for receiving messages
    }
}
