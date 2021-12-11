const { ethers, network } = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

async function main() {
  let [owner]  = await ethers.getSigners();

  const usdcAddr = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const DaoToken = await ethers.getContractFactory("DaoToken");
  const token = await DaoToken.deploy();
  await token.deployed();

  console.log("DaoToken deployed to:", token.address);
  await writeAddr(token.address, "DaoToken")

  const FundDao = await ethers.getContractFactory("FundDao");
  const fundDao = await FundDao.deploy(usdcAddr, token.address);
  await fundDao.deployed();

  console.log("FundDao deployed to:", fundDao.address);
  await writeAddr(fundDao.address, "FundDao")

  await token.transferMinter(fundDao.address);

  console.log("DaoToken transfer Minter to FundDao");

  const Governor = await ethers.getContractFactory("Governor");
  const gov = await Governor.deploy(token.address);
  await gov.deployed();
  console.log("Governor deployed to:", fundDao.address);
  await writeAddr(gov.address, "Governor")

  await fundDao.transferOwnership(gov.address);
  console.log("FundDao transfer ownership to Governor");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

