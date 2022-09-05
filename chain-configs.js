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
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
}

// Supported networks include live testnets but not mainnet for this project, as we don't want to push to mainnet accidentally.
const supportedNetworks = ["rinkeby", "goerli", "hardhat", "localhost"]
const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6

module.exports = {
    chainConfigs,
    developmentChains,
    supportedNetworks,
    VERIFICATION_BLOCK_CONFIRMATIONS,
}
