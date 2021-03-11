pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// DappToKen -> RewardToken
// ERC20("DApp Token", "DAPP")-> ERC20("Reward Token", "REWA")

contract DappToken is ERC20 {
    constructor() public ERC20("Reward Token", "REWA") {
        _mint(msg.sender, 1000000000000000000000000);
    }
}