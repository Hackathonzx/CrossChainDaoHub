// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts-ccip/src/v0.8/Router.sol";
import "./VotingOnChainA.sol"; // Adjust the path if necessary
import "./VotingOnChainB.sol"; // Adjust the path if necessary

contract VotingAggregator {
    // Define the Chainlink CCIP Router address and contract instances
    Router public router;
    VotingOnChainA public chainAContract;
    address public chainBContract;

    // Event for cross-chain voting
    event VoteAggregated(uint256 votesFromChainA);

    // Constructor to initialize the router and contract addresses
    constructor(address _router, address _chainAContract, address _chainBContract) {
        router = Router(_router);
        chainAContract = VotingOnChainA(_chainAContract);
        chainBContract = _chainBContract;
    }

    // Function to aggregate votes from Chain A and send to Chain B
    function aggregateVotesAndSendToChainB() public payable {
        // Get votes from Chain A
        uint256 votesFromChainA = chainAContract.getVotes(); // Adjust function if it needs arguments
        
        // Prepare data payload to send to Chain B
        bytes memory payload = abi.encodeWithSignature("receiveVote(uint256)", votesFromChainA);

        // Send data payload to Chain B using CCIP
        router.ccipSend(
            /* destinationChainId */ 2, // Replace with actual destination chain ID
            payload
        );

        // Emit event
        emit VoteAggregated(votesFromChainA);
    }
}
