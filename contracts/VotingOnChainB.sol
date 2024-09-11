// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts-ccip/src/v0.8/ccip/Router.sol";
import "./VotingOnChainA.sol";


contract VotingOnChainB {
    Router public router;

    mapping(address => bool) public hasVoted;
    mapping(string => uint256) public votes;  // Same as on Chain A

    event VoteSubmitted(address indexed voter, string option);
    event CrossChainVoteSent(string option, uint256 chainId);

    constructor(address _router) {
        router = Router(_router);
    }

    function vote(string calldata option, uint256 destinationChainId) external payable {
        require(!hasVoted[msg.sender], "You have already voted");

        votes[option] += 1;
        hasVoted[msg.sender] = true;

        // Send the vote to Chain A
        bytes memory payload = abi.encode(option);
        // router.ccipSend(destinationChainId, payload, msg.value);
        router.ccipSend(destinationChainId, payload);  // Remove msg.value if not required


        emit VoteSubmitted(msg.sender, option);
        emit CrossChainVoteSent(option, destinationChainId);
    }

    function ccipReceive(bytes calldata payload) external {
        string memory receivedOption = abi.decode(payload, (string));
        votes[receivedOption] += 1;  // Add vote from Chain A
    }

    function getVotes(string calldata option) public view returns (uint256) {
        return votes[option];
    }
}
