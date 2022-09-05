/* INTEGRATION TESTS
              1. test user 1 who is not deployer can NOT mint from the Shop
              2. test deployer who is owner CAN mint from shop, have token balance
              3. transfer ownership to TokenMinter and then user 1, and user 2 each can mint
              4. test that on minting an event is emitted.
              5. Event emit testing: https://hardhat.org/hardhat-chai-matchers/docs/overview#events
              
*/
const { deployments, ethers, network, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../chain-configs")
const { expect } = require("chai")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("TokenShop Integration Tests", async () => {
          let token, tokenMinter, tokenShop, priceFeed, deployer

          beforeEach(async () => {
              token = await ethers.getContract("SmartConToken")
          })

          describe("Token Contract Owner is Deployer", async () => {
              it("FIXME: dummy test", async () => {
                  accounts = await ethers.getSigners()
                  deployer = accounts[0]
                  let tokenOwner = await token.owner()
                  expect(tokenOwner).to.equal(deployer.address)
              })
          })
      })
