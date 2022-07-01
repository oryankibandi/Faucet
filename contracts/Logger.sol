// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

//`abstract` - shows that every child contract has to implement this function
abstract contract Logger {
    function emitLog() public pure virtual returns (bytes32);
}
