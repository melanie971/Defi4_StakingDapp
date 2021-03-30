/* eslint-disable @typescript-eslint/no-var-requires */
const { oracle } = require('@chainlink/test-helpers')
const { expectRevert, time } = require('@openzeppelin/test-helpers')


contract('TokenFarm', accounts => {
  const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
  const { Oracle } = require('@chainlink/contracts/truffle/v0.6/Oracle')
 
  const DappToken = artifacts.require("DappToken");
  const TokenFarm = artifacts.require("TokenFarm");

  const defaultAccount = accounts[0]
  const oracleNode = accounts[1]
  const stranger = accounts[2]
  const consumer = accounts[3]

  LinkToken.web3.setProvider(provider);
  Oracle.web3.setProvider(provider);

  // These parameters are used to validate the data was received
  // on the deployed oracle contract. The Job ID only represents
  // the type of data, but will not work on a public testnet.
  // For the latest JobIDs, visit a node listing service like:
  // https://market.link/
  const jobId = web3.utils.toHex('4c7b7ffb66b344fbaa64995af81e355a')
  const url = 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,JPY'
  const path = 'USD'
  const times = 100

  // Represents 1 LINK for testnet requests
  const payment = web3.utils.toWei('1')

  let link, oc, dappToken, tokenFarm, cc

  beforeEach(async () => {
    link = await LinkToken.new({ from: defaultAccount })
    oc = await Oracle.new(link.address, { from: defaultAccount })
    //cc = await MyContract.new(link.address, { from: consumer })
    dappToken = await DappToken.new({ from: defaultAccount }) //not sure about the from:
    tokenFarm = await TokenFarm.new(dappToken.address, { from: defaultAccount }) //not sure about the from:
    
    // Transfer all Dapp tokens to farm (1 million)
    await dappToken.transfer(tokenFarm.address, tokens("1000000"));

    await oc.setFulfillmentPermission(oracleNode, true, {
      from: defaultAccount,
    });

    //Ajout Mel: transfert link to contract //not sure about that either
    await link.transfer(consumer, web3.utils.toWei('1', 'ether'), {
      from: defaultAccount,
    })
  })


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

})
