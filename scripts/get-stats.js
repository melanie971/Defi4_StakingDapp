const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function(callback) {
  let tokenFarm = await TokenFarm.deployed();
  let totalValue = await tokenFarm.getUserTotalValue(
    "0x4B079e0D870b10c2EB64231f90FAfB4D330938Ce"
  );

  console.log(totalValue.toString());
  callback();
};
