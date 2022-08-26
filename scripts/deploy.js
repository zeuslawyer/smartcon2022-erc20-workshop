// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // const lockedAmount = hre.ethers.utils.parseEther("1");

  const FAKE_ADDRESS = "0x0000000000000000000000000000000000000000";

  console.log("#1 Deploying the Token contract...");
  const Token = await hre.ethers.getContractFactory("SmartConToken");
  const tokenContract = await Token.deploy();
  await tokenContract.deployed();
  console.log(
    "#1 Token Contract deployed OK at address ",
    tokenContract.address
  );

  console.log("#2 Deploying the Token Minter contract...");
  const TokenMinter = await hre.ethers.getContractFactory("TokenMinter");
  const tokenMinterContract = await TokenMinter.deploy(tokenContract.address);
  await tokenMinterContract.deployed();
  console.log(
    "#2 Token Minter Contract deployed OK at address ",
    tokenMinterContract.address
  );

  console.log("#3 Deploying the Token Shop contract...");
  const TokenShop = await hre.ethers.getContractFactory("TokenShop");
  const tokenShopContract = await TokenShop.deploy(
    tokenMinterContract.address,
    FAKE_ADDRESS
  );
  await tokenShopContract.deployed();
  console.log(
    "#2 Token Shop Contract deployed OK at address ",
    tokenShopContract.address
  );
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
