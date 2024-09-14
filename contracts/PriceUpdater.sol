// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";
import "./Marketplace.sol";

contract PriceUpdater is AutomationCompatibleInterface {
    Marketplace public marketplace;

    constructor(address _marketplace) {
        marketplace = Marketplace(_marketplace);
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    ) 
        external 
        view 
        override 
        returns (bool upkeepNeeded, bytes memory performData)
    {
        upkeepNeeded = (block.timestamp >= marketplace.lastUpdateTime() + marketplace.UPDATE_INTERVAL());
        performData = ""; // Empty bytes as we don't need to pass any data to performUpkeep
    }

    function performUpkeep(
        bytes calldata /* performData */
    )
        external
        override
    {
        if (block.timestamp >= marketplace.lastUpdateTime() + marketplace.UPDATE_INTERVAL()) {
            marketplace.updatePrice();
        }
    }
}