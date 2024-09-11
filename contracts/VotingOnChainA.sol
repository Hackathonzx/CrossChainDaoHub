// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts-ccip/src/v0.8/ccip/Router.sol";  // CCIP Router for cross-chain messaging

contract VotingOnChainA {
    Router public router;

    mapping(address => bool) public hasVoted;
    mapping(string => uint256) public votes;  // Stores votes for different options (e.g., "Option1", "Option2")
    
    event VoteSubmitted(address indexed voter, string option);
    event CrossChainVoteSent(string option, uint256 chainId);

    constructor(address _router) {
        router = Router(_router);  // Chainlink CCIP Router address
    }

    function vote(string calldata option, uint256 destinationChainId) external payable {
        require(!hasVoted[msg.sender], "You have already voted");

        votes[option] += 1;
        hasVoted[msg.sender] = true;

        // Send vote to Chain B using Chainlink CCIP
        bytes memory payload = abi.encode(option);
        router.ccipSend(destinationChainId, payload, msg.value);  // Sends vote to Chain B
        
        emit VoteSubmitted(msg.sender, option);
        emit CrossChainVoteSent(option, destinationChainId);
    }

    // This function will be called when a vote arrives from another chain
    function ccipReceive(bytes calldata payload) external {
        string memory receivedOption = abi.decode(payload, (string));
        votes[receivedOption] += 1;  // Record the vote on this chain
    }

    // Get the vote count for a specific option
    function getVotes(string calldata option) public view returns (uint256) {
        return votes[option];
    }
}
