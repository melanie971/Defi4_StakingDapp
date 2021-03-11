import React, { Component } from "react";
import Web3 from "web3";
import DappToken from "../abis/DappToken.json";
import TokenFarm from "../abis/TokenFarm.json";
import ERC20 from "../abis/ERC20.json"; 
import Navbar from "./Navbar";
import Main from "./Main";
import "./App.css";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    }


    async changeToken(address) {
      await this.setState({ tokenAddress: address });
      await this.updateBalance(address).then(this.render());
    }

    async updateBalance(address) {
      const web3 = window.web3;
      const erc20 = new web3.eth.Contract(ERC20.abi, this.state.tokenAddress);
      await this.setState({ erc20 });
      let erc20Balance = await erc20.methods.balanceOf(this.state.account).call();
      await this.setState({ erc20Balance: erc20Balance.toString() });
      await this.updateStakingBalance();
    }

    async updateStakingBalance() {
      const web3 = window.web3;
      const networkId = await web3.eth.net.getId();
      const tokenFarmData = TokenFarm.networks[networkId];
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi,tokenFarmData.address);

      //stakingBalance[token][msg.sender]
      let linkStakingBalance = await tokenFarm.methods.stakingBalance("0xa36085F69e2889c224210F603D836748e7dC0088", this.state.account).call();
      let xeenusStakingBalance = await tokenFarm.methods.stakingBalance("0xaFF4481D10270F50f203E0763e2597776068CBc5", this.state.account).call();
      let weenusStakingBalance = await tokenFarm.methods.stakingBalance("0x022E292b44B5a146F2e8ee36Ff44D3dd863C915c", this.state.account).call();
      this.setState({ linkStakingBalance: linkStakingBalance.toString() });
      this.setState({ xeenusStakingBalance: xeenusStakingBalance.toString() });
      this.setState({ weenusStakingBalance: weenusStakingBalance.toString() });
    }

  async loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    this.setState({ tokenAddress: "0xa36085F69e2889c224210F603D836748e7dC0088" }); //Link by default
   
    const networkId = await web3.eth.net.getId();

    // Load LINK as the starting default Token Data
    const erc20 = new web3.eth.Contract(ERC20.abi, this.state.tokenAddress);
    this.setState({ erc20 });
    let erc20Balance = await erc20.methods.balanceOf(this.state.account).call();
    this.setState({ erc20Balance: erc20Balance.toString() });

  

    // Load DappToken
    const dappTokenData = DappToken.networks[networkId];
    if (dappTokenData) {
      const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address);
      this.setState({ dappTokenAddress: dappTokenData.address });
      this.setState({ dappToken });
      let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call();
      this.setState({ dappTokenBalance: dappTokenBalance.toString() });
    } else {
      window.alert("DappToken contract not deployed to detected network.");
    }

    // Load TokenFarm
    const tokenFarmData = TokenFarm.networks[networkId];
    if (tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address);
      this.setState({ tokenFarm });
      this.updateStakingBalance();
      
    } else {
      window.alert("TokenFarm contract not deployed to detected network.");
    }

    this.setState({ loading: false });
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  stakeTokens = (amount, tokenAddress) => {
    this.setState({ loading: true });
    this.state.erc20.methods
      .approve(this.state.tokenFarm._address, amount) // why _address ?: because when contract not deployed yet?
      .send({ from: this.state.account })
      .on("receipt", (r) => { //"transactionHash", (hash)
        this.state.tokenFarm.methods
          .stakeTokens(amount, tokenAddress)
          .send({ from: this.state.account })
          .on("transactionHash", (hash) => {
            this.setState({ loading: false });
          });
      });
  };

  // stakeTokens = (amount) => { 
  //   this.state.daiToken.methods.
  //   approve("0xcE596ddaB7fA101D9B0929C712e4360b401012Ca", amount)
  //   .send({ from: this.state.account })
  //   .on('transactionHash', (hash) => {
  //   this.state.tokenFarm.methods
  //     .stake(amount)
  //     .send({ from: this.state.account })
  //     .on('transactionHash', (hash) => {
  //     this.setState({ loading: false })
  //   })
  // })
  // }

  unstakeTokens = (address) => {
    this.setState({ loading: true });
    this.state.tokenFarm.methods.unstakeTokens(address).send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "0x0",
      erc20: {},
      dappToken: {},
      dappTokenAddress: "",
      tokenFarm: {},
      erc20Balance: "0",
      dappTokenBalance: "0",
      linkStakingBalance: "0",
      wennusStakingBalance: "0",
      xeenusStatingBalance: "0",
      loading: true,
    };
  }

  render() {
    let content;
    if (this.state.loading) {
      content = (
        <p id="loader" className="text-center">
          Loading...
        </p>
      );
    } else {
      content = (
        <Main
          erc20Balance={this.state.erc20Balance}
          dappTokenBalance={this.state.dappTokenBalance}
          dappTokenAddress={this.state.dappTokenAddress}
          linkStakingBalance={this.state.linkStakingBalance}
          weenusStakingBalance={this.state.weenusStakingBalance}
          xeenusStakingBalance={this.state.xeenusStakingBalance}
          stakeTokens={this.stakeTokens.bind(this)}
          unstakeTokens={this.unstakeTokens.bind(this)}
          updateBalance={this.updateBalance.bind(this)}
          tokenAddress={this.state.tokenAddress}
          changeToken={this.changeToken.bind(this)}
        />
      );
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: "600px" }}
            >
              <div className="content mr-auto ml-auto">
                <a
                  href="https://www.gemini.com/cryptopedia/what-is-chainlink-and-how-does-it-work"
                  target="_blank"
                  rel="noopener noreferrer"
                ></a>

                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
