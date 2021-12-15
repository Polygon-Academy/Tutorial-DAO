<template>
  <div class="content">
    <h1>FundDao Demo</h1>

    <el-divider content-position="left">加入基金会</el-divider>
    USDC余额: {{ myUSDCBalance }} USDC
    <div class="row-center">
    <el-input v-model="amount" placeholder="USDC 数量"></el-input>
    <el-button type="primary" @click="approveUSDC">授权</el-button>
    <el-button type="primary" @click="join"> 加入 </el-button>
    </div>

    <el-divider content-position="left">提案</el-divider>
    <el-card class>
      <div>
      投票权: {{ myBalance }} DaoToken</div>
      <div>
      资金池: {{ fundBalance }} USDC
      </div>
      <div class="row-center">
        <el-input v-model="fundAmount" placeholder="申请资金数量"></el-input>
        <el-button type="primary" @click="proposeFund"> 申请资金提案 </el-button>
      </div>
    </el-card>
    <el-divider content-position="left">提案列表</el-divider>
    <el-card class="card" v-for="(propose , id) in proposeList" :key="id" >
      <div> 提案#{{id}} - {{  propose.desc }} </div> 

      <div> 提案状态: <b>{{  proposalState[propose.state] }}</b> </div> 
      <div> 投票数据:  {{  propose.forVotes }} 赞成票, {{  propose.againstVotes }} 反对票 </div> 
      <div> 我的投票：{{  propose.myVotes }} </div> 

      <el-button type="primary" @click="voteFor(id)"> 赞成 </el-button>
      <el-button type="primary" @click="voteAgainst(id)"> 反对 </el-button>
      <el-button type="primary" :disabled="propose.state!=3" @click="execute(id)">执行</el-button>
    </el-card>

  </div>


</template>

<script>
import { ethers } from 'ethers'

export default {
  name: 'Demo',
  data() {
    return {
      amount: null,
      myBalance: null,
      fundBalance: null,
      fundAmount: null,
      myUSDCBalance: null,
      
      proposalState: ["等待投票", "投票中", "失败", "成功", "过期", "已执行"],
      proposeList: {}
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
      this.getBalance();
      this.getProposes();
    },

    getBalance() {
      this.daoToken.balanceOf(this.account).then((r) => {
        this.myBalance = ethers.utils.formatUnits(r, 18);
      })

      this.usdc.balanceOf(this.account).then((r) => {
        this.myUSDCBalance = ethers.utils.formatUnits(r, 18);
      })

      this.usdc.balanceOf(this.fundDao.address).then((r) => {
        this.fundBalance = ethers.utils.formatUnits(r, 18);
      })
      
    },

    approveUSDC() {
      this.usdc.approve(this.fundDao.address, ethers.constants.MaxUint256);
    },

    join() {
      let amount = ethers.utils.parseUnits(this.amount, 18);
      this.fundDao.join(amount);
    },

    proposeFund() {
      let amount = ethers.utils.parseUnits(this.fundAmount, 18);

      let iface = new ethers.utils.Interface(["function appayFund(address receiver, uint256 amount)"])
      const data = iface.encodeFunctionData("appayFund", [this.account, amount]);
      console.log("calldata:" , data);
      const desc = "Appay " + this.fundAmount +  " USDC"

      this.gov.propose([this.fundDao.address],[0], [""], [data], desc, {from: this.account}).then(() => {
        return this.governor.proposalCount();
      }).then((id) => {
        this.getPropose(id);
      })

    },

    voteFor(id) {
      this.gov.castVote(id, true).then(() => {
        this.getPropose(id);
      })
    },

    voteAgainst(id) {
      this.gov.castVote(id, false).then(() => {
        this.getPropose(id);
      })
    },

    execute(id) {
      this.gov.execute(id).then(() => {
        this.getPropose(id);
      })
    },

    async getProposes() {
      let num = await this.gov.proposalCount();
      for (let i = num.toNumber(); i > 0; i--) {
        await this.getPropose(i);
      }
    },

    async getPropose(id) {
      let proposeInfo = await this.gov.proposals(id);
      // let action = await this.gov.getActions(id);
      let state = await this.gov.state(id);
      let myReceipt = await this.gov.getReceipt(id, this.account)
      // console.log("proposeInfo:", proposeInfo)
      // console.log("state:", state)
      // console.log("myReceipt:", myReceipt)

       this.proposeList[proposeInfo.id] = {
          forVotes: ethers.utils.formatUnits(proposeInfo.forVotes, 18),
          againstVotes: ethers.utils.formatUnits(proposeInfo.againstVotes, 18),
          desc: proposeInfo.desc,
          myVotes: ethers.utils.formatUnits(myReceipt.votes, 18),
          support: myReceipt.support,
          state: state,
       }

      this.$forceUpdate();
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

.card {
  margin: 10px 0px;
}
</style>
