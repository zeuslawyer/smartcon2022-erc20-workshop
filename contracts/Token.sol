// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "hardhat/console.sol";

// By default Ownable contracts are owned by the deployer.
contract SmartConToken is ERC20, Ownable {
    constructor() ERC20("SmartConToken", "SCT") {}

    /**
     * @dev Only the Owner account can mint SCT.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
