const { getNamedAccounts, deployments, network, ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    const chainId = network.config.chainId

    const DECIMALS = "8"
    const INITIAL_PRICE = (100 * 1e8).toString() // $100 with 8 decimals

    //   If we are on a local development network, we need to deploy mocks!
    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        log("Deploying Mock Link Token...")
        const linkToken = await deploy("LinkToken", { from: deployer, log: true })

        log("Deploying Mock Oracle...")
        await deploy("MockOracle", {
            from: deployer,
            log: true,
            args: [linkToken.address],
        })

        log("Deploying Mock Aggregator V3...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })

        log("------------------------OK--------------------------------")
        log(
            "Please run 'yarn hardhat console --network localhost' to interact with the deployed smart contracts!"
        )
        log("----------------------------------------------------------")
    } else {
        log(`Skipping Mocks deployment on non-local network ${network.name}, id ${chainId}`)
    }
}
module.exports.tags = ["all", "mocks"]
