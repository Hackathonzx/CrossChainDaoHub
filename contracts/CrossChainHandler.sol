// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {CarbonCredit} from "./CarbonCredit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract CrossChainHandler is CCIPReceiver, Ownable {
    CarbonCredit public carbonCredit;
    mapping(uint64 => bool) public whitelistedChains;
    
    event CrossChainTransferInitiated(address indexed sender, uint64 destinationChainSelector, address recipient, uint256 amount);
    event CrossChainTransferReceived(uint64 sourceChainSelector, address sender, address recipient, uint256 amount);

    constructor(address _carbonCreditAddress, address _router) CCIPReceiver(_router) Ownable(msg.sender) {
        carbonCredit = CarbonCredit(_carbonCreditAddress);
    }

    function whitelistChain(uint64 _chainSelector) external onlyOwner {
        whitelistedChains[_chainSelector] = true;
    }

    function transferCarbonCreditCrossChain(
        uint64 destinationChainSelector,
        address recipient,
        uint256 amount
    ) external payable {
        require(whitelistedChains[destinationChainSelector], "Destination chain not whitelisted");
        require(recipient != address(0), "Invalid recipient address");

        carbonCredit.burn(msg.sender, amount);

        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](0);
        
        bytes memory payload = abi.encode(msg.sender, recipient, amount);

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(address(this)),
            data: payload,
            tokenAmounts: tokenAmounts,
            extraArgs: "",
            feeToken: address(0)
        });

        IRouterClient router = IRouterClient(this.getRouter());
        router.ccipSend{value: msg.value}(destinationChainSelector, message);

        emit CrossChainTransferInitiated(msg.sender, destinationChainSelector, recipient, amount);
    }

    function _ccipReceive(Client.Any2EVMMessage memory message) internal override {
        (address sender, address recipient, uint256 amount) = abi.decode(message.data, (address, address, uint256));
        
        carbonCredit.mint(recipient, amount);

        emit CrossChainTransferReceived(message.sourceChainSelector, sender, recipient, amount);
    }
}