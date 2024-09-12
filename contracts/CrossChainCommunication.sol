// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ICustomCrossChain.sol";

interface IDAOGovernance {
    function processCrossChainVote(uint256 _proposalId, bool _voteSupport, address _voter) external;
}

contract CrossChainCommunication is Ownable {
    ICustomCrossChain public crossChain;
    address public daoGovernanceContract;

    event MessageReceived(bytes message);

    // Pass the _initialOwner directly to the Ownable constructor
    constructor(address _ccipAddress, address _daoGovernanceContract, address _initialOwner) Ownable(_initialOwner) {
        crossChain = ICustomCrossChain(_ccipAddress);
        daoGovernanceContract = _daoGovernanceContract;
    }

    function sendMessage(bytes memory _message, address _targetChain) public onlyOwner {
        crossChain.sendMessage(_message, _targetChain);
    }

    function handleReceivedMessage(bytes memory _message) public {
        emit MessageReceived(_message);

        // Decode the message
        (uint256 proposalId, bool voteSupport, address voter) = abi.decode(_message, (uint256, bool, address));
        
        // Call DAO Governance contract to process the vote
        IDAOGovernance(daoGovernanceContract).processCrossChainVote(proposalId, voteSupport, voter);
    }
}
