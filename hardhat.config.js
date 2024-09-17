require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
//require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-ignition");
require('dotenv').config();

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.19", // Ensure this matches the imported library version
      },
      {
        version: "0.8.20",
      },
    ],
  },
  networks: {
    IntersectTestnet: {
      url: process.env.AVALANCHE_URL,
      chainId: 1612,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
