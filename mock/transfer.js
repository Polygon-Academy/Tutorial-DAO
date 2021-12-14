const { ethers } = require("hardhat");


async function getUSDC() {
  let [ signer ]  = await ethers.getSigners();
  return await ethers.getContractAt("USDC",
    USDCAddr.address,
    signer);
}


async function main() {
  let usdc = await getUSDC();
  usdc.transfer("0x6cc67A6D136ED539d6505C545240Cf99aD1396fB", ethers.utils.parseEther(1));
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
