<template>
  <div class="hello">
    <h1>FundDao Demo</h1>
    <div class="row-center">
    <el-input v-model="amount" placeholder="USDC 数量"></el-input>
    <el-button type="primary" @click="approveUSDC">Approve</el-button>
    <el-button type="primary" @click="join">Join</el-button>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers'

export default {
  name: 'Demo',
  data() {
    return {
      amount: null
    }
  },

  async created() {
    await this.initAccount();
    await this.initContract();
  },

  methods: {
    async initAccount() {
      if (window.ethereum) {
        try {
          this.accounts = await window.ethereum.enable()
          console.log("accounts:" + this.accounts);
          this.account = this.accounts[0];

          this.provider = new ethers.providers.Web3Provider(window.ethereum);
          this.signer = this.provider.getSigner();

          this.network = await this.provider.getNetwork()

        } catch (error) {
          console.log("User denied account access");
        }
      } else {
        console.log("Need install MetaMask");
      }
    },

    getContract(ContractName) {
      const addr = require(`../../../deployments/${this.network.chainId}/${ContractName}.json`);
      const abi = require(`../../../deployments/abi/${ContractName}.json`);
      return new ethers.Contract(addr.address, abi, this.signer);
    },

    async initContract() {
      this.usdc = this.getContract("USDC");
      this.daoToken = this.getContract("DaoToken");
      this.gov = this.getContract("Governor");
      this.fundDao = this.getContract("FundDao");
      // const b = await this.usdc.totalSupply()

    },

    approveUSDC() {
      this.usdc.approve(this.fundDao.address, ethers.constants.MaxUint256);
    },

    join() {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.row-center {
  display: flex;
  margin-top: 4px;
  flex-direction: row;
  justify-content: center;
}
</style>
