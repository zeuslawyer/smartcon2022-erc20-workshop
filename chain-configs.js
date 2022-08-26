const chainConfigs = {
  default: {
    name: "hardhat",
    fee: "100000000000000000",
    ethUsdPriceFeed: "0x0000000000000000000000000000000000000000",
  },
  31337: {
    name: "localhost",
    fee: "100000000000000000",
    // Price Feed Address is obtained dynamically when mocks are deployed.
  },
  4: {
    name: "rinkeby",
    ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
  },
  5: {
    name: "goerli",
    ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
  },
};

// Supported networks include live testnets but not mainnet.
const supportedNetworks = ["rinkeby", "goerli", "hardhat", "localhost"];

const developmentChains = ["hardhat", "localhost"];
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;

module.exports = {
  chainConfigs,
  developmentChains,
  supportedNetworks,
  VERIFICATION_BLOCK_CONFIRMATIONS,
};
