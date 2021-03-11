import React, { Component } from "react";
import chainlink from "../chainlink.png";
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
              <td>
                {window.web3.utils.fromWei(this.props.dappTokenBalance, "Ether")}{" "}
                <img src= {rewardToken} height="54" alt="" />
                Reward Token
              </td>
           
            </tr>
            
          </tbody>
        </table>

        <div className="card mb-4" style={{border: '1px solid rgba(0,0,250,23'}}>
          <div className="card-body">
            <form
              className="mb-3"
              onSubmit={(event) => {
                event.preventDefault();
                this.props.changeToken("0xa36085F69e2889c224210F603D836748e7dC0088", "LINK", chainlink);
                let amount;
                amount = this.input.value.toString();
                amount = window.web3.utils.toWei(amount, "Ether");
                this.props.stakeTokens(amount, this.props.tokenAddress);
              }}
            >
              <div>
                <label className="float-left"> <b>Stake Link Tokens</b> &nbsp;&nbsp; <img src= {chainlink} height="32" alt="" /> </label>
                  <span className="float-right text-muted">
                  Link balance:
                  &nbsp;&nbsp;&nbsp; {window.web3.utils.fromWei(this.props.erc20Balance, "Ether")} {" "}
                  <br></br>
                  Staked amount:
                  &nbsp;&nbsp;&nbsp; {window.web3.utils.fromWei(this.props.stakingBalance, "Ether")}{" "}
                  <br></br>
                  &nbsp;&nbsp;&nbsp;
                </span>
                
                
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(input) => {this.input = input;}}
                  className="form-control form-control-lg"
                  placeholder="0"
                  required
                />
                <div className="input-group-append">
                <button type="submit" className="btn btn-success btn-block btn-lg">
                Stake!
                </button>

                </div>
              </div>
                            
            </form>
            <button
              type="submit"
              className="btn btn-info btn-danger btn-sm"
              onClick={(event) => {
                event.preventDefault();
                this.props.changeToken("0xa36085F69e2889c224210F603D836748e7dC0088", "LINK", chainlink);
                this.props.unstakeTokens(this.props.tokenAddress);
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
