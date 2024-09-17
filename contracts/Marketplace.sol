// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CarbonCredit.sol";
import "./MockOracle.sol";
import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard, Ownable {
    CarbonCredit public carbonCredit;
    AggregatorV3Interface internal priceFeed;
    MockOracle public mockOracle;

    uint256 public pricePerCredit;
    uint256 public lastUpdateTime;
    uint256 public constant UPDATE_INTERVAL = 1 hours;

    bytes public verificationResult;
    bytes32 public latestRequestId;

    mapping(bytes32 => uint256) private pendingRequests;

    event CreditsPurchased(address buyer, uint256 amount, uint256 cost);
    event CreditsSold(address seller, uint256 amount, uint256 payment);
    event VerifiedCreditStatus(bytes32 requestId, bytes result);

    constructor(
        address _carbonCreditAddress,
        address _priceFeedAddress,
        address _mockOracleAddress
    ) Ownable(msg.sender) {
        console.log("Deploying with addresses:", _carbonCreditAddress, _priceFeedAddress, _mockOracleAddress);
        carbonCredit = CarbonCredit(_carbonCreditAddress);
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
        mockOracle = MockOracle(_mockOracleAddress);
        console.log("Constructor completed");
    }

    function updatePrice() public {
        require(block.timestamp >= lastUpdateTime + UPDATE_INTERVAL, "Too soon to update");
        (, int256 price,,,) = priceFeed.latestRoundData();
        pricePerCredit = uint256(price);
        lastUpdateTime = block.timestamp;
    }

    function verifyCarbonCredit(uint256 projectId) public returns (bytes32) {
        bytes32 requestId = mockOracle.requestProjectData(projectId);
        pendingRequests[requestId] = projectId;
        latestRequestId = requestId;
        return requestId;
    }

    function fulfillProjectData(bytes32 requestId, bytes memory result) public {
        require(msg.sender == address(mockOracle), "Only MockOracle can fulfill");
        require(pendingRequests[requestId] != 0, "Request not found");

        delete pendingRequests[requestId];

        verificationResult = result;
        emit VerifiedCreditStatus(requestId, result);
    }

    function buyCredits(uint256 amount, uint256 projectId) external payable nonReentrant {
        bytes32 requestId = verifyCarbonCredit(projectId);
        mockOracle.fulfillProjectData(requestId, projectId);

        require(keccak256(verificationResult) == keccak256(abi.encode("valid")), "Carbon credits not verified");

        uint256 cost = amount * pricePerCredit;
        require(msg.value >= cost, "Insufficient payment");
        
        carbonCredit.transferFrom(address(this), msg.sender, amount);
        
        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }
        
        emit CreditsPurchased(msg.sender, amount, cost);
    }

    function sellCredits(uint256 amount, uint256 projectId) external nonReentrant {
        bytes32 requestId = verifyCarbonCredit(projectId);
        mockOracle.fulfillProjectData(requestId, projectId);

        require(keccak256(verificationResult) == keccak256(abi.encode("valid")), "Carbon credits not verified");

        uint256 payment = amount * pricePerCredit;
        
        carbonCredit.transferFrom(msg.sender, address(this), amount);
        payable(msg.sender).transfer(payment);
        
        emit CreditsSold(msg.sender, amount, payment);
    }

    function getProjectDetails(uint256 projectId) external view returns (string memory, string memory, uint256, uint256) {
        return mockOracle.getProjectDetails(projectId);
    }

    function getProjectCredits(uint256 projectId) external view returns (uint256) {
        return mockOracle.getProjectCredits(projectId);
    }

    function getLatestPrice() public view returns (uint256) {
        return pricePerCredit;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }

    function updateMockOracle(address _newMockOracle) external onlyOwner {
        require(_newMockOracle != address(0), "Invalid address");
        mockOracle = MockOracle(_newMockOracle);
    }

    function updatePriceFeed(address _newPriceFeed) external onlyOwner {
        require(_newPriceFeed != address(0), "Invalid address");
        priceFeed = AggregatorV3Interface(_newPriceFeed);
    }
}