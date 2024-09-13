// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./CarbonCredit.sol";

contract Marketplace {
    CarbonCredit public carbonCredit;
    uint256 public pricePerCredit;

    constructor(address _carbonCreditAddress, uint256 _pricePerCredit) {
        carbonCredit = CarbonCredit(_carbonCreditAddress);
        pricePerCredit = _pricePerCredit;
    }

    function buyCredits(uint256 amount) external payable {
        require(msg.value == amount * pricePerCredit, "Incorrect ETH amount");
        carbonCredit.transfer(msg.sender, amount);
    }

    function sellCredits(uint256 amount) external {
        carbonCredit.transferFrom(msg.sender, address(this), amount);
        payable(msg.sender).transfer(amount * pricePerCredit);
    }
}
