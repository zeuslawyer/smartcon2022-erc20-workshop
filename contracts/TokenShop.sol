// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "hardhat/console.sol";

import "./TokenInterface.sol";

contract TokenShop {
    TokenInterface tokenMinter;
    uint256 public constant TOKEN_PRICE_USD = 20 * 1e18; // 1 token = 20 usd, with 18 decimal places

    AggregatorV3Interface internal immutable priceFeed;

    constructor(address minter) {
        tokenMinter = TokenInterface(minter);

        // GOERLI address 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        // Rinkeby address 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        priceFeed = AggregatorV3Interface(
            0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        );
    }

    /**
     * Returns the latest price up to 8 decimals.
     * Something like 1614_40343597.
     */
    function getLatestPrice() public view returns (int) {
        (
            ,
            /*uint80 roundID*/
            int price, /*uint startedAt*/ /*uint timeStamp*/ /*uint80 answeredInRound*/
            ,
            ,

        ) = priceFeed.latestRoundData();
        return price;
    }

    /**
     * Calculates how many tokens a caller can buy with the Eth they supply.
     * Uses the Eth/USD exchange rate powered by Chainlink Price Feeds.
     * pricePaidWei is in Wei, so 18 decimal places.
     * Returns the number, to 18 decimal places.
     */
    function calculateTokens(uint256 pricePaidWei)
        public
        view
        returns (uint256)
    {
        // Convert price feed from 8 decimals to 18 decimal places
        uint256 ethUsd = uint256(getLatestPrice()) * 1e10;

        uint256 numTokens = pricePaidWei * (ethUsd / TOKEN_PRICE_USD);

        console.log("num tokens done...");

        return numTokens;
    }

    function pay() external payable {
        uint256 numTokens = calculateTokens(msg.value);
        tokenMinter.mint(msg.sender, numTokens);
    }

    receive() external payable {
        uint256 numTokens = calculateTokens(msg.value);
        tokenMinter.mint(msg.sender, numTokens);
    }
}
