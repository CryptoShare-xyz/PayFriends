// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract USDCMock is ERC20 {
    constructor() ERC20("USDC", "USC") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
