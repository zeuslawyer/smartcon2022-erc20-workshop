const { deployments, ethers, network } = require("hardhat")
const { developmentChains } = require("../../chain-configs")
const { assert, expect } = require("chai")
const { BigNumber } = require("ethers")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("TokenShop Unit Tests", async () => {
          let token, tokenMinter, tokenShop, priceFeed

          const BN_EIGHTEEN_DECIMAL_PLACES = ethers.BigNumber.from((1e18).toString())

          beforeEach(async () => {
              await deployments.fixture("all")
              priceFeed = await ethers.getContract("MockV3Aggregator")
              token = await ethers.getContract("SmartConToken")
              tokenMinter = await ethers.getContract("TokenMinter")
              tokenShop = await ethers.getContract("TokenShop")
          })

          it("should correctly calculate tokens to be minted for 1.7Eth", async () => {
              const onePointSevenEth = ethers.utils.parseEther("1.7")
              const expectedNumTokens = "8500000000000000000" // 8.5 tokens, to 18 decimals.

              const numTokens = await tokenShop.calculateTokens(onePointSevenEth) // returns to 18 decimals.

              expect(numTokens.toString()).to.equal(expectedNumTokens)
              // Alternative expect.
              expect(numTokens.eq(ethers.BigNumber.from(expectedNumTokens))).to.be.true

              // Test value to two decimal places.
              numTokensFloat = (
                  numTokens.toString() / BN_EIGHTEEN_DECIMAL_PLACES.toString()
              ).toFixed(2)
              expect(numTokensFloat).to.equal("8.50") // toFixed returns a string.
          })

          it("should correctly calculate tokens to be minted for 0.5Eth", async () => {
              const halfEth = ethers.utils.parseEther("0.5")
              const expectedNumTokens = "2500000000000000000" // 2.5 tokens, to 18 decimals.

              const numTokens = await tokenShop.calculateTokens(halfEth) // returns to 18 decimals.

              expect(numTokens.toString()).to.equal(expectedNumTokens)
              // Alternative expect.
              expect(numTokens.eq(ethers.BigNumber.from(expectedNumTokens))).to.be.true

              // Test value to two decimal places.
              numTokensFloat = (
                  numTokens.toString() / BN_EIGHTEEN_DECIMAL_PLACES.toString()
              ).toFixed(2)
              expect(numTokensFloat).to.equal("2.50") // toFixed returns a string.
          })

          it.only("should correctly calculate tokens to be minted for 5000Eth", async () => {
              const largeEthQty = ethers.utils.parseEther("3330")
              const expectedNumTokens = "16650000000000000000000" // 16650 tokens, to 18 decimals.

              const numTokens = await tokenShop.calculateTokens(largeEthQty) // returns to 18 decimals.

              expect(numTokens.toString()).to.equal(expectedNumTokens)
              // Alternative expect.
              expect(numTokens.eq(ethers.BigNumber.from(expectedNumTokens))).to.be.true

              // Test value to two decimal places.
              numTokensFloat = (
                  numTokens.toString() / BN_EIGHTEEN_DECIMAL_PLACES.toString()
              ).toFixed(2)
              expect(numTokensFloat).to.equal("16650.00") // toFixed returns a string.
          })
      })
