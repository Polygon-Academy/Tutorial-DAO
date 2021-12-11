pragma solidity >=0.8.0;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDC is ERC20 {
  constructor() ERC20("Mock-USDC", "USDC") {
    _mint(msg.sender, 10000000000 * 10 ** 18);
  }
}
