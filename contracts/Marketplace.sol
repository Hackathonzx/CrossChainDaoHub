// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
// import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "./CarbonCredit.sol";
// import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol"; // Import ChainlinkClient for real oracle
// import "hardhat/console.sol";

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CarbonCredit.sol";

contract Marketplace is ReentrancyGuard, Ownable {
    CarbonCredit public carbonCredit;
    AggregatorV3Interface internal priceFeed;

    uint256 public pricePerCredit;
    uint256 public lastUpdateTime;
    uint256 public constant UPDATE_INTERVAL = 1 hours;

    event CreditsPurchased(address buyer, uint256 amount, uint256 cost);
    event CreditsSold(address seller, uint256 amount, uint256 payment);

    constructor(
        address _carbonCreditAddress,
        address _priceFeedAddress
    ) Ownable(msg.sender) {
        carbonCredit = CarbonCredit(_carbonCreditAddress);
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
    }

    function updatePrice() public {
        require(block.timestamp >= lastUpdateTime + UPDATE_INTERVAL, "Too soon to update");
        (, int256 price,,,) = priceFeed.latestRoundData();
        pricePerCredit = uint256(price);
        lastUpdateTime = block.timestamp;
    }

    function buyCredits(uint256 amount) external payable nonReentrant {
        uint256 cost = amount * pricePerCredit;
        require(msg.value >= cost, "Insufficient payment");

        carbonCredit.transferFrom(address(this), msg.sender, amount);
        
        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }

        emit CreditsPurchased(msg.sender, amount, cost);
    }

    function sellCredits(uint256 amount) external nonReentrant {
        uint256 payment = amount * pricePerCredit;

        carbonCredit.transferFrom(msg.sender, address(this), amount);
        payable(msg.sender).transfer(payment);

        emit CreditsSold(msg.sender, amount, payment);
    }

    function getLatestPrice() public view returns (uint256) {
        return pricePerCredit;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
}