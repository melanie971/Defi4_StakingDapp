// Load dependencies
const { accounts, provider} = require('@openzeppelin/test-environment'); //contract, provider
//const { expect } = require('chai');
const { assert } = require("chai");

// // Load compiled artifacts
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken');
// const { provider } = require('@chainlink/test-helpers/dist/src/setup');
const { Oracle } = require('@chainlink/contracts/truffle/v0.4/Oracle');

LinkToken.setProvider(provider);
Oracle.setProvider(provider);

//Load my contracts
const DappToken = artifacts.require("DappToken");
const TokenFarm = artifacts.require("TokenFarm");


require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("TokenFarm", async accounts => { //  ([owner, investor])
  let dappToken, tokenFarm, linkToken, oc;
  const owner = accounts[0];
  const investor = accounts[1];
  const [creator] = accounts;

  beforeEach('setup contracts for each test case', async () => {
    // Load Contracts
    dappToken = await DappToken.new({from: owner});
    tokenFarm = await TokenFarm.new(dappToken.address, {from: owner});
    
    // oc = await Oracle.new(link.address, {from: owner});
    linkToken = await LinkToken.new({from: owner});
   

    // Transfer all Dapp tokens to farm (1 million)
    await dappToken.transfer(tokenFarm.address, tokens("1000000"), {from: owner});

    });

  describe("Dapp Token deployment", async () => {
    it("has a name", async () => {
      const name = await dappToken.name({from: owner});
      assert.equal(name, "Reward Token");
    });
  });

  describe("Token Farm deployment", async () => {
    it("has a name", async () => {
      const name = await tokenFarm.name({from: owner});
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
	// 	it('Link tokens are staked', async () => {
	
  // Do we need this?
  //   // Allow staking LINK token - !!! need to transfer some first?
  //   await tokenFarm.addAllowedTokens(linkToken.address, {from: owner});

  //   // setting PriceFeed ? à voir I don't remember
  //   await tokenFarm.setPriceFeedContract(linkToken.address,"0x3Af8C569ab77af5230596Acf0E8c2F9351d24C38", { from: owner });

      
  ////Stake Link Token
	// 	await linkToken.approve(tokenFarm.address, tokens('75'), {from: investor});			
	// 	await tokenFarm.stakeTokens(tokens('75'), linkToken.address, {from: investor});

  ////Check staking result
  //  let result;
	// 	result = await linkToken.balanceOf(investor);
	// 	assert.equal(result.toString(), tokens('25'), 'investor Link Token Wallet balance correct AFTER staking');

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
