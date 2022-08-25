// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
interface TokenInterface {
    function mint(address account, uint256 amount) external;
    function transferOwnership(address newOwner) external;
}
