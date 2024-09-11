// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract OracleBasedVoteVerification {
    AggregatorV3Interface internal priceFeed;
    
    constructor(address _oracle) {
        priceFeed = AggregatorV3Interface(_oracle);
    }

    // Verify the result by comparing off-chain data
    function verifyVoteOutcome(int256 threshold) public view returns (bool) {
        (, int256 result,,,) = priceFeed.latestRoundData();
        return result > threshold;
    }
}
