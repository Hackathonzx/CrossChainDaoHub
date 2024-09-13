// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CarbonCredit is ERC20 {
    constructor() ERC20("Carbon Credit Token", "CCT") {}

    // Minting function
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    // Burning function
    function burn(address from, uint256 amount) external {
        _burn(from, amount);
    }
}
