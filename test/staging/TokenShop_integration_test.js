const { deployments, ethers, network, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../chain-configs")
const { expect } = require("chai")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("TokenShop Integration Tests", async () => {
          let token, tokenMinter, tokenShop

          before(async () => {
              token = await ethers.getContract("SmartConToken")
              tokenMinter = await ethers.getContract("TokenMinter")
              tokenShop = await ethers.getContract("TokenShop")
          })

          describe("Non Owner cannot mint", async () => {
              it("Mints tokens when Token Minter is Owner", async () => {
                  const [deployer] = await ethers.getSigners()

                  let o = await token.owner()
                  if (o === deployer.address) {
                      console.log(
                          `Transferring ownership from ${deployer.address} to ${tokenMinter.address} `
                      )
                      const ownershipTransferTx = await token
                          .connect(deployer)
                          .transferOwnership(tokenMinter.address)
                      ownershipTransferTx.wait(1)
                  }

                  const sendValue = ethers.utils.parseEther("0.000001")

                  // We use the deploying account as the buyer for testing on testnets as other addresses are not configured
                  // and may not have enough ETH to buy SmartCon Tokens.
                  const deployerStartingBalance = await token.balanceOf(deployer.address)
                  const tokenShopStartingBalance = await ethers.provider.getBalance(
                      tokenShop.address
                  )

                  let payTx = await tokenShop.connect(deployer).pay({ value: sendValue })
                  await expect(payTx.wait(1)).to.not.be.revertedWith(
                      "Ownable: caller is not the owner"
                  )

                  const deployerEndingBalance = await token.balanceOf(deployer.address)
                  const tokenShopEndingBalance = await ethers.provider.getBalance(tokenShop.address)
                  const tokenShopEarnings = tokenShopEndingBalance.sub(tokenShopStartingBalance)

                  const numTokensMinted = await tokenShop.calculateTokens(sendValue)
                  const tokensReceived = deployerEndingBalance.sub(deployerStartingBalance)

                  // Check updated states.
                  expect(tokensReceived).to.equal(numTokensMinted)
                  expect(tokenShopEarnings).to.equal(sendValue)
              })
          })
      })
