// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

interface IERC173
{
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    function owner() view external returns(address);
	 
    function transferOwnership(address _newOwner) external;	
}