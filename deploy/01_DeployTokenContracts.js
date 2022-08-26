const { getNamedAccounts, deployments, network, ethers } = require("hardhat");
const {
  chainConfigs,
  supportedNetworks,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../chain-configs");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let PRICE_FEED_ADDRESS;
  const WAIT_CONFIRMATIONS = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;

  // ONLY DEPLOY CONTRACTS TO SUPPORTED LOCAL AND TEST NETS.
  if (!supportedNetworks.includes(network.name)) {
    const errMsg = `Attempting to Deploy to unsupported chain: ${network.name}`;
    throw new Error(errMsg);
  }

  if (chainId === 31337) {
    const priceFeed = await deployments.get("MockV3Aggregator");
    PRICE_FEED_ADDRESS = priceFeed.address;
  } else {
    PRICE_FEED_ADDRESS = chainConfigs[chainId].ethUsdPriceFeed;
  }

  const token = await deploy("SmartConToken", {
    from: deployer,
    log: true,
    waitConfirmations: WAIT_CONFIRMATIONS,
  });

  const tokenMinter = await deploy("TokenMinter", {
    from: deployer,
    args: [token.address],
    log: true,
    waitConfirmations: WAIT_CONFIRMATIONS,
  });

  const tokenShop = await deploy("TokenShop", {
    from: deployer,
    args: [tokenMinter.address, PRICE_FEED_ADDRESS],
    log: true,
    waitConfirmations: WAIT_CONFIRMATIONS,
  });
};

module.exports.tags = ["all"];
