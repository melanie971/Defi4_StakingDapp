const DappToken = artifacts.require("DappToken");
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function(deployer, network, accounts) {
  // Deploy TokenFarm - transfer all DappToken to TokenFarm
  const dappToken = await DappToken.deployed();
  await deployer.deploy(TokenFarm, dappToken.address);
  const tokenFarm = await TokenFarm.deployed();
  await dappToken.transfer(tokenFarm.address, "1000000000000000000000000");
 

  //adding authorized tokens
  if (network.startsWith("kovan") || network.startsWith("development")) {

    // LINK Token address
    await tokenFarm.addAllowedTokens(
      "0xa36085F69e2889c224210F603D836748e7dC0088"
    );
    await tokenFarm.setPriceFeedContract(
      "0xa36085F69e2889c224210F603D836748e7dC0088",
      "0x3Af8C569ab77af5230596Acf0E8c2F9351d24C38" // address feed price Kovan LINK/ETH
    );

    //WEENUS Token, since there is no address feed price for Kovan WEENUS/ETH we use the DAI price feed address
    await tokenFarm.addAllowedTokens(
      "0xaFF4481D10270F50f203E0763e2597776068CBc5"
    );
    await tokenFarm.setPriceFeedContract(
      "0xaFF4481D10270F50f203E0763e2597776068CBc5",
      "0x22B58f1EbEDfCA50feF632bD73368b2FdA96D541"// address feed price Kovan DAI/ETH
    );

    //XEENUS Token, since there is no address feed price for Kovan XEENUS/ETH we use the DAI price feed address
    await tokenFarm.addAllowedTokens(
      "0x022E292b44B5a146F2e8ee36Ff44D3dd863C915c"
    );
    await tokenFarm.setPriceFeedContract(
      "0x022E292b44B5a146F2e8ee36Ff44D3dd863C915c",
      "0x22B58f1EbEDfCA50feF632bD73368b2FdA96D541"// address feed price Kovan DAI/ETH
    );


   }
};
