// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./Ownable.sol";
import "./IDaoToken.sol";
import "./TransferHelper.sol";

interface IERC20 {
  function decimals() external view returns (uint8);
  function balanceOf(address owner) external view returns (uint);
}

// transfer Owner to Gover
contract FundDao is Ownable {

  address public immutable usdt;

  IDaoToken public immutable daotoken;
  
  event Withdrawal(address indexed user, uint256 amount);
  event Join(address indexed user, uint256 amount);
  event Quit(address indexed user, uint256 amount);

  constructor(address _usdt, IDaoToken _daotoken) {
    usdt = _usdt;
    daotoken = _daotoken;
  }

  function join(uint amount) public {
    TransferHelper.safeTransferFrom(usdt, msg.sender, address(this), amount);
    daotoken.mint(msg.sender, uint96(amount));
  }

	function appayFund(address receiver, uint256 amount) external onlyOwner {
    emit Withdrawal(receiver, amount);
    TransferHelper.safeTransfer(usdt, receiver, amount);
	}

  function quit() external {
    address user = msg.sender;
    uint share = daotoken.balanceOf(user);
    require(share >= 0, "Not Member");

    uint balance = IERC20(usdt).balanceOf(address(this));
 
    uint amount = share * balance / daotoken.totalSupply() ;
    emit Quit(user, amount);
    daotoken.burn(user, uint96(share));

    TransferHelper.safeTransfer(usdt, user, amount);
  }

}