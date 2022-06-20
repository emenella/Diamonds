// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "../interfaces/IERC165.sol";
import "../libraries/DiamondLib.sol";

contract ERC165Facet is IERC165
{
    function supportsInterface(bytes4 interfaceID) external view returns (bool)
    {
        return LibDiamond.diamondStorage().supportedInterfaces[interfaceID];
    }
}