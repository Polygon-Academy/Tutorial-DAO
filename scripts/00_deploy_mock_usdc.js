const { ethers, network } = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

async function main() {
  let [owner]  = await ethers.getSigners();

  const USDC = await ethers.getContractFactory("USDC");
  const usdc = await USDC.deploy();
  await usdc.deployed();

  console.log("USDC deployed to:", usdc.address);
  await writeAddr(usdc.address, "USDC")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

