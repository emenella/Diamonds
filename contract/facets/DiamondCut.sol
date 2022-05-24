pragma solidity ^0.8.8;

import "../libraries/DiamondLib.sol";
import "../interfaces/IDiamondCut.sol";

contract DiamondCut is IDiamondCut
{
    function diamondCut( FacetCut[] calldata _diamondCut, address _init, bytes calldata _calldata) external
    {
        
    }
}