// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IERC20} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";

contract PoolInteractions {

    address payable public owner;

    IPoolAddressesProvider public immutable ADDRESSES_PROVIDER;
    IPool public immutable POOL;
    address public immutable linkAddress = 0x60f42c880B61D9114251882fC144395843D9839d;
    IERC20 private link;


    constructor(address _addressProvider) {
        ADDRESSES_PROVIDER = IPoolAddressesProvider(_addressProvider);
        POOL = IPool(ADDRESSES_PROVIDER.getPool());
        owner = payable(msg.sender);
        link = IERC20(linkAddress);
    }

    function supplyLiquidity(address _tokenAddress, uint256 _amount) external{
        address asset = _tokenAddress;
        uint256 amount = _amount;
        address onBehalfOf = address(this);
        uint16 referralCode = 0;

        POOL.supply(asset, amount, onBehalfOf, referralCode);
    }

    function withdrawlLiquidity(address _tokenAddress, uint256 _amount) external 
    returns (uint256) {
        address asset = _tokenAddress;
        uint256 amount = _amount;
        address to = address(this);

        return POOL.withdraw(asset, amount, to);
    }

    function getUserAccountData(address _userAddress) external view returns (
        uint256 totalCollateralBase,
        uint256 totalDebtBase,
        uint256 availableBorrowsBase,
        uint256 currentLiquidationThreshold,
        uint256 ltv,
        uint256 healthFactor
    ) {
        return POOL.getUserAccountData(_userAddress);
    }

    function approveLINK(uint256 _amount, address _poolContractAddress)
        external
        returns (bool)
    {
        return link.approve(_poolContractAddress, _amount);
    }

    function allowanceLINK(address _poolContractAddress)
        external
        view
        returns (uint256)
    {
        return link.allowance(address(this), _poolContractAddress);
    }

    function getBalance(address _tokenAddress) external view returns (uint256) {
        return IERC20(_tokenAddress).balanceOf(address(this));
    }
    
    function withdraw(address _tokenAddress) external onlyOwner {
        IERC20 token = IERC20(_tokenAddress);
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }

    receive() external payable {}
}