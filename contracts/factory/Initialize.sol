pragma solidity ^0.8.8;

import "../libraries/DiamondLib.sol";
import "../libraries/ERC20Lib.sol";
import "../interfaces/IERC20.sol";
import "../interfaces/IERC173.sol";
import "../interfaces/IERC165.sol";
import "../interfaces/IDiamondLoupe.sol";

contract InitializeDiamond
{
    function initialize(string memory _name, string memory _symbol, uint256 _initSupply, uint256 _maxSupply) external
    {
        ERC20Lib.ERC20 storage es = ERC20Lib.ERC20Storage();
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        
        require(bytes(es.name).length == 0 && bytes(es.symbol).length == 0, "ALREADY_INITIALIZED");
        require(bytes(_name).length != 0 && bytes(_symbol).length != 0, "INVALID_PARAMS");
        require(msg.sender == ds.contractOwner, "You must be owner");

        //Initaliaze
        ds.supportedInterfaces[type(IERC20).interfaceId] = true;
        ds.supportedInterfaces[type(IERC173).interfaceId] = true;
        ds.supportedInterfaces[type(IERC165).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondLoupe).interfaceId] = true;
        es.name = _name;
        es.symbol = _symbol;
        es.maxSupply = _maxSupply;
        ERC20Lib.mint(msg.sender, _initSupply);
    }
}
