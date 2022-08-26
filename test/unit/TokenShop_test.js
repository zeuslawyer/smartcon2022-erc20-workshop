const { deployments, ethers, network } = require("hardhat")
const { developmentChains } = require("../../chain-configs")
const { assert, expect } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("TokenShop Unit Tests", async () => {
          let token, tokenMinter, tokenShop, priceFeed

          beforeEach(async () => {
              await deployments.fixture("all")
              priceFeed = await ethers.getContract("MockV3Aggregator")
              token = await ethers.getContract("SmartConToken")
              tokenMinter = await ethers.getContract("TokenMinter")
              tokenShop = await ethers.getContract("TokenShop")
          })

          it("should ", async () => {
              console.log(" OK ZUBIN ", {
                  feed: priceFeed.address,
                  token: token.address,
                  minter: tokenMinter.address,
                  shop: tokenShop.address,
              })

              // TODO: RESUME HERE.
              /*               1. test user 1 who is not deployer can NOT mint from the Shop
              2. test deployer who is owner CAN mint from shop, have token balance
              3. transfer ownership to TokenMinter and then user 1, and user 2 each can mint
              4. test that on minting an event is emitted. */
          })
      })
