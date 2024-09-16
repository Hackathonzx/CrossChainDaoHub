// contracts/LinkToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LinkToken is ERC20 {
    constructor() ERC20("Chainlink Token", "LINK") {
        _mint(msg.sender, 1000000 * 10**18); // Mint 1 million LINK tokens to the deployer
    }
}
