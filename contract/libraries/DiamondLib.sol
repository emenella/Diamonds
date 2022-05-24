pragma solidity ^0.8.8;

library DiamondLib
{
    bytes32 constant DIAMOND_STORAGE_POSITION = keccak256("diamond.storage");

    struct DiamondStorage
    {
        mapping(bytes4 => bytes32) facets;
        mapping(uint256 => bytes32) selectorSlots;
        uint16 selectorCount;
        mapping(bytes4 => bool) supportedInterfaces;
    }

    function diamondStorage() internal pure returns (DiamondStorage storage ds)
    {
        bytes32 position = DIAMOND_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }
}