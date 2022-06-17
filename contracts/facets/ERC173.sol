// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "../interfaces/IERC173.sol";
import "../libraries/DiamondLib.sol";

contract ERC173 is IERC173
{
    function initialize() external
    {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();

        require(ds.contractOwner != msg.sender, "You must be Owner");
        require(ds.supportedInterfaces[type(IERC173).interfaceId] != false, "Already initialize");

        ds.supportedInterfaces[type(IERC173).interfaceId] = true;
    }

    function owner() view external returns(address)
    {
        return LibDiamond.diamondStorage().contractOwner;
    }
	 
    function transferOwnership(address _newOwner) external
    {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();

        require(ds.contractOwner != msg.sender, "You must be Owner");
        ds.contractOwner = _newOwner;
        emit OwnershipTransferred(msg.sender, _newOwner);
    }
}