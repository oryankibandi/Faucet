// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";

contract Faucet is Owned, Logger, IFaucet {
    //storage variables
    uint256 funds = 0;
    uint256 public numOfFunders = 0;

    mapping(address => bool) private donators;
    mapping(uint256 => address) private lutDonators;

    uint256[] public donated;

    modifier limitWithdraw(uint256 withdrawAmount) {
        require(
            withdrawAmount <= 100000000000000000,
            " ==> You cannot withdraw more than 0.1 ETH"
        );
        _;
    }

    function deposit(uint256 _num) external payable {
        funds += _num / 1000000000000000000;
        donated.push(msg.value);
    }

    //this withdraws eth(whichever token) from the smart contract to a specific account
    function withdraw(uint256 withdrawAmount)
        external
        limitWithdraw(withdrawAmount)
    {
        payable(msg.sender).transfer(withdrawAmount);
    }

    function getFunders() public view returns (address[] memory) {
        address[] memory _funders = new address[](numOfFunders);

        for (uint256 i = 0; i < numOfFunders; i++) {
            _funders[i] = lutDonators[i];
        }

        return _funders;
    }

    function getFunderAtIndex(uint256 index) external view returns (address) {
        // address[] memory _funders = getFunders();
        return lutDonators[index];
    }

    //function that allows receiving of eth
    receive() external payable {}

    //function to fund the contract
    function addFunds() external payable {
        if (!donators[msg.sender]) {
            lutDonators[numOfFunders] = msg.sender;
            numOfFunders++;
            donators[msg.sender] = true;
        }
    }

    function test1() external onlyOwner {}

    //transferring ownership of a contract
    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    function emitLog() public pure override returns (bytes32) {
        return "Hello world";
    }
}

//const instance = await Faucet.deployed()
//instance.addFunds({from: accounts[1], value: '1500000000000000000'})
//instance.getFunders()
//instance.withdraw("100000000000000000", {from: accounts[2]})
