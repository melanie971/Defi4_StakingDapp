pragma solidity ^0.6.0;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

// already used in Chainlink so no need to add them?
// import "@openzeppelin/contracts/utils/Address.sol";
// import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";



contract TokenFarm is ChainlinkClient, Ownable {
    string public name = "Dapp Token Farm";
    IERC20 public dappToken;

    address[] public stakers;
    address[] allowedTokens;
    // token > address
    mapping(address => mapping(address => uint256)) public stakingBalance;
    mapping(address => uint256) public uniqueTokensStaked;
    mapping(address => address) public tokenPriceFeedMapping; //tokens -> Ethereum price feed, à remplir par l'admin. address token => address price feed here:https://docs.chain.link/docs/ethereum-addresses
    

    constructor(address _dappTokenAddress) public {
        dappToken = IERC20(_dappTokenAddress);
    }

    //Setting tokens allowed for staking 
    // functions are used in 3_deploy_token_farm.js but could be elsewhere ?

    function addAllowedTokens(address token) public onlyOwner {
        allowedTokens.push(token);
    }

    function setPriceFeedContract(address token, address priceFeed) public onlyOwner
    {
        tokenPriceFeedMapping[token] = priceFeed;
    }

    
    //User functions
    // User put tokens into the dapp (making then a deposit)
    function stakeTokens(uint256 _amount, address token) public {
        // Amount must be greater than zero
        require(_amount > 0, "amount cannot be 0");
        //le if et TokenIsAllowed sont-ils vraiment nécessaires?
        if (tokenIsAllowed(token)) {
            updateUniqueTokensStaked(msg.sender, token);
            //transfer token to this contract for staking
            IERC20(token).transferFrom(msg.sender, address(this), _amount);

            //update staking balance
            stakingBalance[token][msg.sender] = stakingBalance[token][msg.sender].add(_amount);
                        
            //add user to stakers array only if they haven't staked already
            if (uniqueTokensStaked[msg.sender] == 1) {
                stakers.push(msg.sender);
            }
        }
    }

    // Unstaking Tokens (Withdraw) - user can only widthdraw all tokens
      
    function unstakeTokens(address token) public {
        // Fetch staking balance
        uint256 balance = stakingBalance[token][msg.sender];
        // require amount greater than 0
        require(balance > 0, "staking balance cannot be 0");
        //transfer token to staker
        IERC20(token).transfer(msg.sender, balance);
        //reset staking balance
        stakingBalance[token][msg.sender] = 0;
        //update tokens staked status
        uniqueTokensStaked[msg.sender] = uniqueTokensStaked[msg.sender].sub(1);
        
    }


    // Do we really need this ?
        function tokenIsAllowed(address token) public returns (bool) {
        for (
            uint256 allowedTokensIndex = 0;
            allowedTokensIndex < allowedTokens.length;
            allowedTokensIndex++
            ) {
            if (allowedTokens[allowedTokensIndex] == token) {
                return true;
            }
                }       
        return false;
         }

    // Calculating the user reward according to its staked amount and  to the value of each staked tokens relative to real eth price
    // First we need for each token to return its price in eth (that prices vary a lot so we need an oracle to connect us to real price)

    //1. Getting Price from ChainLink Oracle: https://docs.chain.link/docs/get-the-latest-price
    function getTokenEthPrice(address token) public view returns (uint256) {
        address priceFeedAddress = tokenPriceFeedMapping[token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return uint256(price);
    }

   

    //2. Getting Users staking Balance in ETh
     function getUserStakingBalanceEthValue(address user, address token) public view returns (uint256)
    {
        if (uniqueTokensStaked[user] <= 0) {
            return 0;
        }
        return 
        //(stakingBalance[token][user] * getTokenEthPrice(token)) / (10**18);
        (stakingBalance[token][user].mul(getTokenEthPrice(token))).div(10**18);
    }

    //3. Getting User Total Value (i.e. all staked tokens) in Ether for each user

    function getUserTotalValue(address user) public view returns (uint256) {
        uint256 totalValue = 0;
        if (uniqueTokensStaked[user] > 0) {
            for ( uint256 allowedTokensIndex = 0; allowedTokensIndex < allowedTokens.length; allowedTokensIndex++) {
                //totalValue = totalValue + getUserStakingBalanceEthValue(user, allowedTokens[allowedTokensIndex]);
                totalValue = totalValue.add(getUserStakingBalanceEthValue(user, allowedTokens[allowedTokensIndex]));
            }
        }
        return totalValue;
    }


    // Calculating reward for each user and Issuing Reward Tokens
    function issueTokens() public onlyOwner {
        // Issue tokens to all stakers ..looping throughout all stakers
        for (
            uint256 stakersIndex = 0;
            stakersIndex < stakers.length;
            stakersIndex++
        ) {
            address recipient = stakers[stakersIndex];
            //stakers receive an amount proportional to the value in eth that they have deposit
            dappToken.transfer(recipient, getUserTotalValue(recipient)); //balance of total value in eth. 
            // if total Value staked is 10 ETH then the reward will be 10 Reward Token
        }
    }


    function updateUniqueTokensStaked(address user, address token) internal {
        if (stakingBalance[token][user] <= 0) {
            //uniqueTokensStaked[user] = uniqueTokensStaked[user] + 1;
            uniqueTokensStaked[user] = uniqueTokensStaked[user].add(1);
        }
    }

    
}



