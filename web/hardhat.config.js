require("@nomicfoundation/hardhat-toolbox");

/** @type import(hardhat/config).HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    anvil: {
      url: "http://localhost:8545",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
