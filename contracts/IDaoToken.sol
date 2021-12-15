// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

interface IDaoToken {

    function totalSupply() external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);

    function mint(address account, uint96 amount) external ;
    function burn(address account, uint96 amount) external ;

    function getPriorVotes(address account, uint blockNumber) external view returns (uint96);
}
