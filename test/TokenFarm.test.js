// Load dependencies
//const { accounts, contract, provider } = require('@openzeppelin/test-environment');
//const { expect } = require('chai');
// const { assert } = require("chai");

// // Load compiled artifacts
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken');
// const { Oracle } = require('@chainlink/contracts/truffle/v0.4/Oracle');

// LinkToken.setProvider(provider);
// Oracle.setProvider(provider);

//Load my contracts
const DappToken = artifacts.require("DappToken");
const TokenFarm = artifacts.require("TokenFarm");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("TokenFarm", ([owner, investor]) => {
  let dappToken, tokenFarm, linkToken;

  beforeEach(async () => {
    // Load Contracts
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address);
    linkToken = await LinkToken.new();

    // Transfer all Dapp tokens to farm (1 million)
    await dappToken.transfer(tokenFarm.address, tokens("1000000"));

    });

  describe("Dapp Token deployment", async () => {
    it("has a name", async () => {
      const name = await dappToken.name();
      assert.equal(name, "Reward Token");
    });
  });

  describe("Token Farm deployment", async () => {
    it("has a name", async () => {
      const name = await tokenFarm.name();
      assert.equal(name, "Dapp Token Farm");
    });

    it("contract has tokens", async () => {
      let balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens("1000000"));
    });
  });

   describe("Check investor balance in reward token before staking", async () => {
    it("has no reward tokens", async () => {
      let result;
      result = await dappToken.balanceOf(investor);
			assert.equal(result.toString(), tokens('0'), 'investor has reward token')

    });
  });

  // describe('Farming tokens', async () => {
	// 	it('Fake tokens are staked', async () => {
		
  //   // Allow staking LINK token - !!! need to transfer some first?
  //   await tokenFarm.addAllowedTokens(linkToken.address, { from: owner });

  //   //
  //   await tokenFarm.setPriceFeedContract(linkToken.address,"0x3Af8C569ab77af5230596Acf0E8c2F9351d24C38", { from: owner });

  //   // //This does not work
  //   // let res;
  //   // res = await tokenFarm.tokenIsAllowed(fakeToken.address);
  //   // assert.equal(res[1], 'true', "Fake token is not allowed to be staked");
    
  //   //Stake Fake Tokens
	// 	await fakeToken.approve(tokenFarm.address, tokens('75'), {from: investor});			
	// 	await tokenFarm.stakeTokens(tokens('75'), fakeToken.address, {from: investor});

  //   //Check staking result
  //   let result;
	// 	result = await fakeToken.balanceOf(investor);
	// 	assert.equal(result.toString(), tokens('25'), 'investor Fake Token Wallet balance correct AFTER staking');

	// 	result = await fakeToken.balanceOf(tokenFarm.address);
	// 	assert.equal(result.toString(), tokens('75'), 'Token Farm Fake Token balance correct AFTER staking');

  // 	result = await tokenFarm.stakingBalance(fakeToken.address, investor);
	// 	assert.equal(result.toString(), tokens('75'), 'investor staking balance correct after staking');
  //   //console.log(result.toString());

  //   // //does not work
  //   // //console.log(investor.toString()); //investor is second account on ganache
  //   // result = await tokenFarm.stakers(investor);
  //   // console.log(result.toString());
    
	// 	//assert.equal(result.toString(), investor, 'investor staking status correct after staking')

  //   //testing for Issue tokens
	// 		await tokenFarm.issueTokens({ from: owner});

	// 	// //Check balances after issuance
	// 	// result = await dappToken.balanceOf(investor)
	// 	// assert.equal(result.toString(),tokens('100'), 'investor balance in DappToken is correct')

  //   });
  // });


});
