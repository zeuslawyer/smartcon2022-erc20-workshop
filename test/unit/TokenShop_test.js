const { deployments, ethers, network, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../chain-configs")
const { expect } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("TokenShop Unit Tests", async () => {
          let token, tokenMinter, tokenShop, priceFeed

          const BN_EIGHTEEN_DECIMAL_PLACES = ethers.BigNumber.from((1e18).toString())

          beforeEach(async () => {
              // Deploy fixtures.
              await deployments.fixture("all")

              priceFeed = await ethers.getContract("MockV3Aggregator")
              token = await ethers.getContract("SmartConToken")
              tokenMinter = await ethers.getContract("TokenMinter")
              tokenShop = await ethers.getContract("TokenShop")
          })

          describe("Token mint quantity calculations", () => {
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

              it("should correctly calculate tokens to be minted for 3330 Eth", async () => {
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

          describe("Price feed response", () => {
              it("should return the default price feed amount", async () => {
                  const ethUsdPrice = await tokenShop.getLatestPrice()
                  expect(ethUsdPrice.toString()).to.equal((100 * 1e8).toString())
              })

              it("should correctly return updated lower price", async () => {
                  let newEthUsdPrice = ethers.BigNumber.from((91.23427 * 1e8).toString())
                  await priceFeed.updateAnswer(newEthUsdPrice)

                  const ethUsdPrice = await tokenShop.getLatestPrice()

                  expect(ethUsdPrice.toString()).to.equal(newEthUsdPrice.toString())
              })

              it("should correctly return updated higher price", async () => {
                  let newEthUsdPrice = ethers.BigNumber.from((235.568563 * 1e8).toString())
                  await priceFeed.updateAnswer(newEthUsdPrice)

                  const ethUsdPrice = await tokenShop.getLatestPrice()
                  expect(ethUsdPrice.toString()).to.equal(newEthUsdPrice.toString())
              })
          })

          describe("Correctly identifies and changes owner of TokenMinter", () => {
              it("Deployer owns token contract", async () => {
                  let [deployer] = await ethers.getSigners()
                  const defaultOwner = await token.owner()
                  expect(defaultOwner).to.equal(deployer.address)
              })

              it("Transfer ownership to TokenMinter", async () => {
                  let [deployer] = await ethers.getSigners()
                  await token.transferOwnership(tokenMinter.address)
                  const owner = await token.owner()
                  expect(owner).to.not.equal(deployer.address)
                  expect(owner).to.equal(tokenMinter.address)
              })
          })

          describe("Minting works correctly", () => {
              it("Minting from TokenShop not allowed until Minter owns contract", async () => {
                  const sendValue = ethers.utils.parseEther("0.5")
                  const [deployer] = await ethers.getSigners()

                  await expect(
                      tokenShop.connect(deployer).pay({ value: sendValue })
                  ).to.be.revertedWith("Ownable: caller is not the owner")

                  await token.transferOwnership(tokenMinter.address)

                  await expect(tokenShop.connect(deployer).pay({ value: sendValue })).to.not.be
                      .reverted

                  const tokenContractBal = await ethers.provider.getBalance(tokenShop.address)
                  await expect(tokenContractBal).to.equal(sendValue)
              })

              it("Correctly updates the buyer's balance", async () => {
                  const [_, user1, user2] = await ethers.getSigners()

                  const sendValue1 = ethers.utils.parseEther("0.5")
                  const expectedValue1 = "2500000000000000000"

                  const sendValue2 = ethers.utils.parseEther("0.2")
                  const expectedValue2 = "1000000000000000000"

                  await token.transferOwnership(tokenMinter.address)
                  await tokenShop.connect(user1).pay({ value: sendValue1 })
                  await tokenShop.connect(user2).pay({ value: sendValue2 })

                  await expect((await token.balanceOf(user1.address)).toString()).to.equal(
                      expectedValue1
                  )
                  await expect((await token.balanceOf(user2.address)).toString()).to.equal(
                      expectedValue2
                  )
              })
          })

          describe("Event based state changes", () => {
              beforeEach(async () => {
                  await token.transferOwnership(tokenMinter.address)
              })
              afterEach(async function () {
                  token.removeAllListeners()
              })

              it("Token correctly emits events", async () => {
                  const [_, user1] = await ethers.getSigners()
                  const sendValue = ethers.utils.parseEther("0.5")

                  const numTokens = await tokenShop.calculateTokens(sendValue)

                  await expect(tokenShop.connect(user1).pay({ value: sendValue }))
                      .to.emit(token, "TokenMinted")
                      .withArgs(user1.address, user1.address, numTokens) // Origin, Recipient, NumTokens
              })

              it("Updates Buyer and Token Contracts correctly", async function () {
                  // non fat arrow function for `this`.
                  this.timeout(300000) // 300 seconds.

                  const [_, user1] = await ethers.getSigners()
                  const sendValue = ethers.utils.parseEther("0.166")
                  const numTokens = await tokenShop.calculateTokens(sendValue)

                  await new Promise(async (resolve, reject) => {
                      token.once("TokenMinted", async () => {
                          console.log("YEAH!")
                          try {
                              const earnings = await ethers.provider.getBalance(tokenShop.address)
                              const userBalance = await token.balanceOf(user1.address)
                              expect(earnings.toString()).to.equal(sendValue.toString())
                              expect(userBalance.toString()).to.equal(numTokens.toString())
                              resolve(earnings)
                          } catch (error) {
                              reject(error)
                          }
                      })

                      // Fire the chain of contract calls.
                      await tokenShop.connect(user1).pay({ value: sendValue })
                  })
              })
          })
      })
