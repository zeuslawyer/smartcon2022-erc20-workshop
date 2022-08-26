const { getNamedAccounts, deployments, network, ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (chainId === 31337) {
    const priceFeed = await deployments.get("MockV3Aggregator");
  } else {
  }
};
module.exports.tags = ["all", "mocks"];
