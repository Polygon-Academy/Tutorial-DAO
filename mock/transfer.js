const { ethers, network } = require("hardhat");


async function getUSDC(signer) {
  const chainid = network.config.chainId;
  const USDCAddr = require(`../deployments/${chainid}/USDC.json`);

  return await ethers.getContractAt("USDC",
    USDCAddr.address,
    signer);
}


async function main() {
  let [ account0, account1, account2, account3, account4, account5, account6]  = await ethers.getSigners();
  let usdc = await getUSDC(account0);
  
  await usdc.transfer(account1.address, ethers.utils.parseEther("1000"));
  await usdc.transfer(account2.address, ethers.utils.parseEther("1000"));
  await usdc.transfer(account3.address, ethers.utils.parseEther("1000"));
  await usdc.transfer(account4.address, ethers.utils.parseEther("1000"));
  await usdc.transfer(account5.address, ethers.utils.parseEther("1000"));
  await usdc.transfer(account6.address, ethers.utils.parseEther("1000"));

  let b = await usdc.balanceOf(account6.address)
  console.log("b:" + b.toString());
  console.log("transfer done");
}


main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
