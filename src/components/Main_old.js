import React, { Component } from "react";
import chainlink from "../chainlink.png";
import weenus from "../WeenusFakeLogo.png";
import xeenus from "../XeenusFakeLogo.png";
import rewardToken from "../RewardTokenLogo.png";


class Main extends Component {
  render() {
    return (
      <div id="content" className="mt-3">

        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Reward Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td> {window.web3.utils.fromWei(this.props.dappTokenBalance, "Ether")}{" "}
                <img src= {rewardToken} height="54" alt="" />
                Reward Tokens
              </td>
            </tr>
          </tbody>
        </table>
        
    
        <div className="card mb-4" style={{border: '1px solid rgba(0,0,250,23'}}>
          <div className="card-body">
          {console.log(this.props.tokenAddress), console.log(this.props.linkStakingBalance), console.log(this.props.erc20Balance, "Ether")}
            <form className="mb-3" onSubmit={(event) => {
                event.preventDefault();
                let amount;
                amount = this.input.value.toString();
                amount = window.web3.utils.toBN(amount).toString(); //had to add this otherwise error
                amount = window.web3.utils.toWei(amount, 'Ether');
                
                this.props.changeToken("0xa36085F69e2889c224210F603D836748e7dC0088"); // is it ok to put that here?
                // let linkaddress;
                // linkaddress = "0xa36085F69e2889c224210F603D836748e7dC0088";
                // linkaddress = linkaddress.toString();
                this.props.stakeTokens(amount, this.props.tokenAddress); // no here you directly set the right address allowtoken[0]

            }}
            >
              <div>
                <label className="float-left"> <b>Stake Link Tokens</b></label>
                <span className="float-right text-muted">
                  Staking balance:
                  <div className="input-group-text">
                    {window.web3.utils.fromWei(this.props.linkStakingBalance, "Ether")}{" "} 
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <img src= {chainlink} height="32" alt="" />
                    &nbsp;&nbsp; LINK
                  </div>
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(input) => { this.input = input;}}
                  className="form-control form-control-lg"
                  placeholder="0"
                  required />
                <div className="input-group-append">
                <button type="submit" className="btn btn-success btn-block btn-lg">
                Stake !
              </button>
                </div>
              </div>
              
            </form>
            <button
              type="submit"
              className="btn btn-info btn-danger btn-sm"
              onClick={(event) => {
                event.preventDefault();
                this.props.changeToken("0xa36085F69e2889c224210F603D836748e7dC0088");
                this.props.unstakeTokens(this.props.tokenAddress);
              }}
            >
              Unstake
            </button>
          </div>
      </div>

      <div className="card mb-4" style={{border: '1px solid rgba(250,0,0,23'}}>
      <div className="card-body">
        <form className="mb-3" onSubmit={(event) => {
            event.preventDefault();
            let amount;
            amount = this.input.value.toString();
            amount = window.web3.utils.toWei(amount, 'Ether');
            this.props.stakeTokens(amount, "0xaFF4481D10270F50f203E0763e2597776068CBc5"); // Weenus address

        }}
        >
          <div>
            <label className="float-left"> <b>Stake Weenus Tokens</b></label>
            <span className="float-right text-muted">
              Staking balance:
              <div className="input-group-text">
              does not work here
                    &nbsp;&nbsp;&nbsp;&nbsp;
                
                <img src= {weenus} height="32" alt="" />
                &nbsp;&nbsp; WEENUS
              </div>
            </span>
          </div>
          <div className="input-group mb-4">
            <input
              type="text"
              ref={(input) => { this.input = input;}}
              className="form-control form-control-lg"
              placeholder="0"
              required />
            <div className="input-group-append">
            <button type="submit" className="btn btn-success btn-block btn-lg">
            Stake !
          </button>
            </div>
          </div>
          
        </form>
        <button
          type="submit"
          className="btn btn-info btn-danger btn-sm"
          onClick={(event) => {
            event.preventDefault();
            this.props.unstakeTokens("0xaFF4481D10270F50f203E0763e2597776068CBc5"); //to be changed!
          }}
        >
          Unstake
          </button>
        </div>
      </div>

      <div className="card mb-4" style={{border: '1px solid rgba(0,0,0,23'}}>
      <div className="card-body">
        <form className="mb-3" onSubmit={(event) => {
            event.preventDefault();
            let amount;
            amount = this.input.value.toString();
            amount = window.web3.utils.toWei(amount, 'Ether');
            this.props.stakeTokens(amount, "0x022E292b44B5a146F2e8ee36Ff44D3dd863C915c"); // Weenus address

        }}
        >
          <div>
            <label className="float-left"> <b>Stake Xeenus Tokens</b></label>
            <span className="float-right text-muted">
              Staking balance:
              <div className="input-group-text">
                {" "} 
                0 &nbsp;&nbsp;&nbsp;
                <img src= {xeenus} height="32" alt="" />
                &nbsp;&nbsp; XEENUS
              </div>
            </span>
          </div>
          <div className="input-group mb-4">
            <input
              type="text"
              ref={(input) => { this.input = input;}}
              className="form-control form-control-lg"
              placeholder="0"
              required />
            <div className="input-group-append">
            <button type="submit" className="btn btn-success btn-block btn-lg">
            Stake !
          </button>
            </div>
          </div>
          
        </form>
        <button
          type="submit"
          className="btn btn-info btn-danger btn-sm"
          onClick={(event) => {
            event.preventDefault();
            this.props.unstakeTokens("0x022E292b44B5a146F2e8ee36Ff44D3dd863C915c");
          }}
        >
          Unstake
          </button>
        </div>
      </div>






      </div>

    );
  }
}

export default Main;
