const { deployments, ethers, network } = require("hardhat")
const { developmentChains } = require("../../chain-configs")
const { assert, expect } = require("chai")
const { BigNumber } = require("ethers")

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

          it("should correctly calculate tokens to be minted", async () => {
              const onePointSevenEth = ethers.utils.parseEther("1.7")
              const expectedNumTokens = "8500000000000000000" // 8.5 tokens, to 18 decimals.

              const numTokens = await tokenShop.calculateTokens(onePointSevenEth) // returns to 18 decimals.

              assert(parseInt(numTokens.toString()) / 1e18),
                  8.5,
                  "numToken is not the expected value of 8.5"

              expect(numTokens.toString()).to.equal(expectedNumTokens)
              // Alternative expect.
              expect(numTokens.eq(ethers.BigNumber.from(expectedNumTokens))).to.be.true
          })
      })
