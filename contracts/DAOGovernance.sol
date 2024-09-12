// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IExternalContract {
    function performAction(uint256 _value) external;
}

contract DAOGovernance is Ownable {
    struct Proposal {
        uint256 id;
        string description;
        uint256 voteCountYes;
        uint256 voteCountNo;
        bool executed;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        uint256 newValue;
        uint256 actionValue;
    }

    mapping(uint256 => Proposal) public proposals;

    uint256 public votingPeriod;
    IExternalContract public externalContract;

    event ProposalCreated(uint256 proposalId, string description, uint256 startTime, uint256 endTime);
    event VoteCast(uint256 proposalId, bool voteSupport, address voter);
    event ProposalExecuted(uint256 proposalId, bool success);
    event ValueUpdated(uint256 newValue);

    uint256 public stateValue;

    // Pass the _initialOwner directly to the Ownable constructor
    constructor(uint256 _votingPeriod, address _externalContract, address _initialOwner) Ownable(_initialOwner) {
        votingPeriod = _votingPeriod;
        externalContract = IExternalContract(_externalContract);
    }

    function createProposal(uint256 _proposalId, string memory _description, uint256 _newValue, uint256 _actionValue) public onlyOwner {
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.isActive, "Proposal already active");

        proposal.id = _proposalId;
        proposal.description = _description;
        proposal.voteCountYes = 0;
        proposal.voteCountNo = 0;
        proposal.executed = false;
        proposal.startTime = block.timestamp;
        proposal.endTime = block.timestamp + votingPeriod;
        proposal.isActive = true;
        proposal.newValue = _newValue;
        proposal.actionValue = _actionValue;

        emit ProposalCreated(_proposalId, _description, proposal.startTime, proposal.endTime);
    }

    function finalizeProposal(uint256 _proposalId) public {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.isActive, "Proposal not active");
        require(block.timestamp > proposal.endTime, "Voting period not ended");
        require(!proposal.executed, "Proposal already executed");

        bool success = checkVotingOutcome(_proposalId);
        if (success) {
            executeProposal(_proposalId);
        }

        proposal.executed = true;
        proposal.isActive = false;

        emit ProposalExecuted(_proposalId, success);
    }

    function executeProposal(uint256 _proposalId) internal {
        Proposal storage proposal = proposals[_proposalId];
        
        stateValue = proposal.newValue;
        externalContract.performAction(proposal.actionValue);

        emit ValueUpdated(stateValue);
    }

    function checkVotingOutcome(uint256 _proposalId) public view returns (bool) {
        Proposal storage proposal = proposals[_proposalId];
        return proposal.voteCountYes > proposal.voteCountNo;
    }

    function setVotingPeriod(uint256 _votingPeriod) public onlyOwner {
        votingPeriod = _votingPeriod;
    }
}
