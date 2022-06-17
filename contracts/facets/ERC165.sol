// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "../interfaces/IERC165.sol";
import "../libraries/DiamondLib.sol";

contract ERC165Facet is IERC165
{
    function initialize() external
    {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        require(ds.contractOwner == msg.sender, "you must be owner of contract");
        require(ds.supportedInterfaces[type(IERC165).interfaceId] != false, "Already initialized");
        
        ds.supportedInterfaces[type(IERC165).interfaceId] = true;
    }

    function supportsInterface(bytes4 interfaceID) external view returns (bool)
    {
        return LibDiamond.diamondStorage().supportedInterfaces[interfaceID];
    }
}