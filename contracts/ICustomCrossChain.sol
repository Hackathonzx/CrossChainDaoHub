// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ICustomCrossChain {
    function sendMessage(bytes memory _message, address _targetChain) external;
    function receiveMessage(bytes memory _message) external;
}
