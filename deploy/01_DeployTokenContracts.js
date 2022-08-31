const { getNamedAccounts, deployments, network, ethers } = require("hardhat")
const {
    chainConfigs,
    supportedNetworks,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../chain-configs")

module.exports = async ({ getNamedAccounts, deployments }) => {
    // ONLY DEPLOY CONTRACTS TO SUPPORTED LOCAL AND TEST NETS.
    if (!supportedNetworks.includes(network.name)) {
        const errMsg = `Attempting to Deploy to unsupported chain: ${network.name}`
        throw new Error(errMsg)
    }

    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    const isLocalNetwork = chainId === 31337
    const WAIT_CONFIRMATIONS = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    let PRICE_FEED_ADDRESS

    if (isLocalNetwork) {
        const priceFeed = await deployments.get("MockV3Aggregator")
        PRICE_FEED_ADDRESS = priceFeed.address
    } else {
        PRICE_FEED_ADDRESS = chainConfigs[chainId].ethUsdPriceFeed
        log(`Using price feed address for ${network.name} "${PRICE_FEED_ADDRESS}"`)
    }

    const token = await deploy("SmartConToken", {
        from: deployer,
        log: true,
        waitConfirmations: WAIT_CONFIRMATIONS,
    })

    const tokenMinter = await deploy("TokenMinter", {
        from: deployer,
        args: [token.address],
        log: true,
        waitConfirmations: WAIT_CONFIRMATIONS,
    })

    const tokenShop = await deploy("TokenShop", {
        from: deployer,
        args: [tokenMinter.address, PRICE_FEED_ADDRESS],
        log: true,
        waitConfirmations: WAIT_CONFIRMATIONS,
    })
}

module.exports.tags = ["all"]
