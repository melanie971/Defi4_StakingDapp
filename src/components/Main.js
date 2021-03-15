import React, { Component } from "react";
import chainlink from "../chainlink.png";
import rewardToken from "../RewardTokenLogo.png";
import weenus from "../WeenusFakeLogo.png";
import xeenus from "../XeenusFakeLogo.png";

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
                let amount;
                amount = this.input.value.toString();
                amount = window.web3.utils.toWei(amount, "Ether");
                this.props.stakeTokens(amount, "0xa36085F69e2889c224210F603D836748e7dC0088");
              }}
            >
              <div>
                <label className="float-left"> <b>Stake Link Tokens</b> &nbsp;&nbsp; <img src= {chainlink} height="32" alt="" /> </label>
                  <span className="float-right text-muted">
                  Link balance:
                  &nbsp;&nbsp;&nbsp; {window.web3.utils.fromWei(this.props.LinkBalance, "Ether")} {" "}
                  <br></br>
                  Staked amount:
                  &nbsp;&nbsp;&nbsp; {window.web3.utils.fromWei(this.props.LinkStakingBalance, "Ether")}{" "}
                  <br></br>
                  &nbsp;&nbsp;&nbsp;
                </span>
                
                
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(input) => {this.input = input;}}
                  defaultValue = "10"
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
                this.props.unstakeTokens("0xa36085F69e2889c224210F603D836748e7dC0088");
              }}
            >
              Unstake
            </button>
          </div>
        </div>

        <div className="card mb-4" style={{border: '1px solid rgba(0,0,250,23'}}>
        <div className="card-body">
          <form
            className="mb-3"
            onSubmit={(event) => {
              event.preventDefault();
              let amount2;
              amount2 = this.input.value.toString();
              amount2 = window.web3.utils.toWei(amount2, "Ether");
              this.props.stakeTokens(amount2, "0xaFF4481D10270F50f203E0763e2597776068CBc5");
            }}
          >
            <div>
              <label className="float-left"> <b>Stake Weenus Tokens</b> &nbsp;&nbsp; <img src= {weenus} height="32" alt="" /> </label>
                <span className="float-right text-muted">
                Weenus balance:
                &nbsp;&nbsp;&nbsp; {window.web3.utils.fromWei(this.props.WeenusBalance, "Ether")} {" "}
                <br></br>
                Staked amount:
                &nbsp;&nbsp;&nbsp; {window.web3.utils.fromWei(this.props.WeenusStakingBalance, "Ether")}{" "}
                <br></br>
                &nbsp;&nbsp;&nbsp;
              </span>
              
              
            </div>
            <div className="input-group mb-4">
              <input
                type="text"
                ref={(input) => {this.input = input;}}
                defaultValue = "10"
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
              this.props.unstakeTokens("0xaFF4481D10270F50f203E0763e2597776068CBc5");
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
