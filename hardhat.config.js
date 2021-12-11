require("@nomiclabs/hardhat-waffle");
require('hardhat-abi-exporter');

let dotenv = require('dotenv')
dotenv.config({path:"./.env"})

const mnemonic = process.env.MNEMONIC

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.6",
    settings: {
      optimizer: {
        enabled: true
      }
    }
  },

  abiExporter: {
    path: './deployments/abi',
    clear: true,
    flat: true,
    only: [],
    spacing: 2,
    pretty: true,
  },

  networks: {
    dev: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },

    mumbai: {   // Polygon TestNet
      url: "https://rpc-mumbai.matic.today", 
      accounts: {
        mnemonic: mnemonic,
      },
      chainId: 80001
    },


    polygon: {
      url: "https://polygon-rpc.com",  // https://rpc-mainnet.matic.network
      accounts: {
        count: 1,
        initialIndex: 0,
        mnemonic: mnemonic,
        path: "m/44'/60'/0'/0",
      },
      chainId: 5,
    }
  }
};

