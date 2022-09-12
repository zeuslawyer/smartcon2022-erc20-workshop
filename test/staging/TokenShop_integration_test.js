/* INTEGRATION TESTS
              1. test user 1 who is not deployer can NOT mint from the Shop
              3. transfer ownership to TokenMinter and then user 1 can mint via TokenShop pay()
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

          before(async () => {
              token = await ethers.getContract("SmartConToken")
              tokenMinter = await ethers.getContract("TokenMinter")
              tokenShop = await ethers.getContract("TokenShop")
          })

          describe("Only Owner Can Mint", async () => {
              it("reverts when TokenMinter is not Owner", async () => {
                  const sendValue = ethers.utils.parseEther("0.0001")
                  const [deployer] = await ethers.getSigners()

                  await expect(
                      tokenShop.connect(deployer).pay({ value: sendValue })
                  ).to.be.revertedWith("Ownable: caller is not the owner")
              })

              it.only("Mints tokens when Token Minter is Owner", async () => {
                  const [deployer] = await ethers.getSigners()

                  let o = await token.owner()
                  console.log("  Token's current owner is ", o)

                  //   const ownershipTransferTx = await token
                  //       .connect(deployer)
                  //       .transferOwnership(tokenMinter.address)
                  //   ownershipTransferTx.wait(1)

                  const sendValue = ethers.utils.parseEther("0.000001")

                  // We use the deploying account as the buyer for testing on testnets as other addresses are not configured
                  // and may not have enough ETH to buy SmartCon Tokens.
                  const deployerStartingBalance = await token.balanceOf(deployer.address)

                  let payTx = await tokenShop.connect(deployer).pay({ value: sendValue })
                  await payTx.wait(1)

                  // Check tokenShop balance is increased.
                  const tokenContractBal = await ethers.provider.getBalance(tokenShop.address)
                  //   expect(tokenContractBal.toString()).to.equal(
                  //       Number(sendValue.toString())
                  //   )

                  const deployerEndingBalance = await token.balanceOf(deployer.address)
                  const tokensReceived = deployerEndingBalance.sub(deployerStartingBalance)
                  const numTokensMinted = await tokenShop.calculateTokens(sendValue)

                  console.log(
                      "Starting, ending and received : ",
                      deployerStartingBalance.toString(),
                      deployerEndingBalance.toString(),
                      tokensReceived.toString(),
                      numTokensMinted.toString()
                  )

                  expect(tokensReceived.toString()).to.equal(numTokensMinted.toString())
              })
          })
      })
