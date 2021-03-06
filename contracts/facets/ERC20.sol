// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "../libraries/ERC20Lib.sol";
import "../libraries/DiamondLib.sol";
import "../libraries/CallProtection.sol";
import "../interfaces/IERC20.sol";

contract ERC20Facet is IERC20, CallProtection
{
    function name() external view returns (string memory)
    {
        return ERC20Lib.ERC20Storage().name;
    }

    function symbol() external view returns (string memory)
    {
        return ERC20Lib.ERC20Storage().symbol;
    }

    function decimals() external pure returns (uint8)
    {
        return ERC20Lib.decimals();
    }

    function totalSupply() external view returns (uint256)
    {
        return ERC20Lib.ERC20Storage().totalSupply;
    }

    function balanceOf(address _owner) external view returns (uint256 balance)
    {
        return ERC20Lib.balanceOf(_owner);
    }

    function transfer(address _to, uint256 _value) external returns (bool success)
    {
        ERC20Lib.transfer(msg.sender, _to, _value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success)
    {
        ERC20Lib.transferFrom(_from, _to, _value);
        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) external returns (bool success)
    {
        ERC20Lib.approve(msg.sender, _spender,_value);
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) external view returns (uint256 remaining)
    {
        return ERC20Lib.allowance(_owner, _spender);
    }

    function mint(address _account, uint256 _amount) public protectedCall()
    {
        ERC20Lib.mint(_account, _amount);
        emit Transfer(address(0), _account, _amount);
    }
}