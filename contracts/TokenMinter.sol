// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

import "./TokenInterface.sol";

contract tokenMinter {
    TokenInterface public token;

    constructor(address tokenAddress) {
        token = TokenInterface(tokenAddress);
    }

    function mint(address to, uint256 numTokens) external {
        token.mint(to, numTokens);
    }

    function transferOwner(address newOwner) public {
        console.log("transferring to ", newOwner);
        token.transferOwnership(newOwner);
    }
}
