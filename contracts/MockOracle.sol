// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

contract MockOracle {
    struct Project {
        string name;
        string description;
        uint256 estimatedPrice;
        uint256 estimatedAnnualEmissionReduction;
    }

    mapping(uint256 => Project) public projects;
    mapping(uint256 => uint256) public projectCredits;

    LinkTokenInterface public LINK;

    event OracleRequest(bytes32 indexed requestId, address requester);
    event OracleResponse(bytes32 indexed requestId, bytes result);

    constructor(address _link) {
        LINK = LinkTokenInterface(_link);
        
        // Initialize with mock data
        projects[1] = Project("Project A", "Description for Project A", 1000, 5000);
        projects[2] = Project("Project B", "Description for Project B", 2000, 10000);
        
        projectCredits[1] = 100;
        projectCredits[2] = 200;
    }

    function requestProjectData(uint256 _projectId) public returns (bytes32 requestId) {
        requestId = keccak256(abi.encodePacked(_projectId, block.timestamp));
        emit OracleRequest(requestId, msg.sender);
        
        // Simulate async behavior
        return requestId;
    }

    function fulfillProjectData(bytes32 _requestId, uint256 _projectId) public {
        Project memory project = projects[_projectId];
        bytes memory result = abi.encode(project.name, project.description, project.estimatedPrice, project.estimatedAnnualEmissionReduction);
        emit OracleResponse(_requestId, result);
    }

    function getProjectCredits(uint256 _projectId) public view returns (uint256) {
        return projectCredits[_projectId];
    }

    function getProjectDetails(uint256 _projectId) public view returns (string memory, string memory, uint256, uint256) {
        Project memory project = projects[_projectId];
        return (project.name, project.description, project.estimatedPrice, project.estimatedAnnualEmissionReduction);
    }
}