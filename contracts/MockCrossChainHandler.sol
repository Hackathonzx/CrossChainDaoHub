// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {CarbonCredit} from "./CarbonCredit.sol";

contract MockCrossChainHandler {
    CarbonCredit public carbonCredit;

    event TransferInitiated(address indexed sender, uint64 destinationChainSelector, address recipient, uint256 amount);
    event TransferReceived(address sender, address recipient, uint256 amount);

    constructor(address _carbonCreditAddress) {
        carbonCredit = CarbonCredit(_carbonCreditAddress);
    }

    function mockCrossChainTransfer(
        address recipient,
        uint256 amount
    ) external {
        carbonCredit.burn(msg.sender, amount);
        carbonCredit.mint(recipient, amount);

        emit TransferReceived(msg.sender, recipient, amount);
    }
}
