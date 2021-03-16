import React, { Component } from "react";
import Web3 from "web3";
import DappToken from "../abis/DappToken.json";
import TokenFarm from "../abis/TokenFarm.json";
import ERC20 from "../abis/ERC20.json";
import Navbar from "./Navbar";
import Main from "./Main";
import "./App.css";
import chainlink from "../chainlink.png";

//need to care for balances calcul

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  //UpdatingStakingBalance

  async updateStakingBalance() {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const tokenFarmData = TokenFarm.networks[networkId];
    const tokenFarm = new web3.eth.Contract(TokenFarm.abi,tokenFarmData.address);
   
    let LinkStakingBalance = await tokenFarm.methods
      .stakingBalance("0xa36085F69e2889c224210F603D836748e7dC0088", this.state.account)
      .call();
    
    let WeenusStakingBalance = await tokenFarm.methods
      .stakingBalance("0xaFF4481D10270F50f203E0763e2597776068CBc5", this.state.account)
      .call();

   
    this.setState({ LinkStakingBalance: LinkStakingBalance.toString() });
    this.setState({ WeenusStakingBalance: WeenusStakingBalance.toString() });
   
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    this.setState({ tokenAddress: "0xa36085F69e2889c224210F603D836748e7dC0088"});
    const networkId = await web3.eth.net.getId();

    let blocknumber = await web3.eth.getBlockNumber();
    this.setState({ lastblocknumber: blocknumber});

    // Load LINK as the starting default Token Data
    const erc20 = new web3.eth.Contract(ERC20.abi, this.state.tokenAddress);
    this.setState({ erc20 });
    // let erc20Balance = await erc20.methods.balanceOf(this.state.account).call();
    // this.setState({ erc20Balance: erc20Balance.toString() });

    //Token balances
    const erc20link = new web3.eth.Contract(ERC20.abi, "0xa36085F69e2889c224210F603D836748e7dC0088");
    this.setState({ erc20link });
    let LinkBalance = await erc20link.methods.balanceOf(this.state.account).call();
    this.setState({ LinkBalance: LinkBalance.toString() });

    //Weenus balance
    const erc20weenus = new web3.eth.Contract(ERC20.abi, "0xaFF4481D10270F50f203E0763e2597776068CBc5");
    this.setState({ erc20weenus });
    let WeenusBalance = await erc20weenus.methods.balanceOf(this.state.account).call();
    this.setState({ WeenusBalance: WeenusBalance.toString() });

    // Load DappToken
    const dappTokenData = DappToken.networks[networkId];
    if (dappTokenData) {
      const dappToken = new web3.eth.Contract(
        DappToken.abi,
        dappTokenData.address
      );
      this.setState({ dappTokenAddress: dappTokenData.address });
      this.setState({ dappToken });
      let dappTokenBalance = await dappToken.methods
        .balanceOf(this.state.account)
        .call();
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
    const web3 = window.web3;
    const custom_erc20 = new web3.eth.Contract(ERC20.abi, tokenAddress); 

    custom_erc20.methods
      .approve(this.state.tokenFarm._address, amount)
      .send({ from: this.state.account })
      .on("receipt", (r) => {               // here in the original file it was .on(transactionHash)
        this.state.tokenFarm.methods
          .stakeTokens(amount, tokenAddress)
          .send({ from: this.state.account })
          .on("transactionHash", (hash) => {
            this.setState({ loading: false });
          });
      });
  };

  unstakeTokens = (address) => {
    this.setState({ loading: true });
    this.state.tokenFarm.methods
      .unstakeTokens(address)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  };

  
  constructor(props) {
    super(props);
    this.state = {
      account: "0x0",
      lastblocknumber: "0",
      erc20: {},
      erc20link: {},
      erc20weenus: {},
      dappToken: {},
      dappTokenAddress: "",
      tokenFarm: {},
      //erc20Balance: "0",
      LinkBalance: "0",
      WeenusBalance: "0",
      dappTokenBalance: "0",
      LinkStakingBalance: "0",
      WeenusStakingBalance: "0",
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
          //erc20Balance={this.state.erc20Balance}
          LinkBalance={this.state.LinkBalance}
          WeenusBalance={this.state.WeenusBalance}
          dappTokenBalance={this.state.dappTokenBalance}
          dappTokenAddress={this.state.dappTokenAddress}
          lastblocknumber={this.state.lastblocknumber}
          LinkStakingBalance={this.state.LinkStakingBalance}
          WeenusStakingBalance={this.state.WeenusStakingBalance}
          stakeTokens={this.stakeTokens.bind(this)}
          unstakeTokens={this.unstakeTokens.bind(this)}
          tokenAddress={this.state.tokenAddress}
            

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
                  href="https://alphachain.io"
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
