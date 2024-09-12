// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ICustomCrossChain.sol";

contract MockCrossChain is ICustomCrossChain {
    event MessageSent(bytes message, address targetChain);
    event MessageReceived(bytes message);

    function sendMessage(bytes memory _message, address _targetChain) external override {
        emit MessageSent(_message, _targetChain);
    }

    function receiveMessage(bytes memory _message) external override {
        emit MessageReceived(_message);
    }
}
