pragma solidity ^0.8.8;

library ERC20Lib
{
    bytes32 constant ERC20_STORAGE_POSITION = keccak256("diamond.ERC20");
    
    struct ERC20
    {
        mapping(address => uint256) balance;
        mapping(address => mapping(address => uint256)) allowance;
        string name;
        string symbol;
        uint256 totalSupply;
        uint256 maxSupply;
    }

    function ERC20Storage() internal pure returns (ERC20 storage ds)
    {
        bytes32 position = ERC20_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }

    function name() internal view returns (string memory)
    {
        return ERC20Storage().name;
    }

    function symbol() internal view returns (string memory)
    {
        return ERC20Storage().symbol;
    }

    function decimals() internal pure returns (uint8)
    {
        return 18;
    }

    function totalSupply() internal view returns (uint256)
    {
        return ERC20Storage().totalSupply;
    }

    function balanceOf(address _owner) internal view returns (uint256 balance)
    {
        return ERC20Storage().balance[_owner];
    }

    function transfer(address _from, address _to, uint256 _value) internal returns (bool success)
    {
        require(_to != address(0), "address is null");
        require(_value <= balanceOf(_from), "not enough balance");

        ERC20Storage().balance[_from] -= _value;
        ERC20Storage().balance[_to] += _value;
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) internal returns (bool success)
    {
        spendAllowance(_from, msg.sender, _value);
        transfer(_from, _to, _value);
        return true;
    }

    function approve(address _owner, address _spender, uint256 _value) internal returns (bool success)
    {
        require(_spender != address(0), "Spender address is NULL");
        require(_value <= balanceOf(_owner), "Not enough balance");

        ERC20Storage().allowance[_owner][_spender] = _value;
        return true;
    }

    function allowance(address _owner, address _spender) internal view returns (uint256 remaining)
    {
        return ERC20Storage().allowance[_owner][_spender];
    }

    function mint(address _to, uint256 _amount) internal
    {
        ERC20 storage es = ERC20Storage();
        require(_to != address(0), "address is NULL");
        require(es.totalSupply + _amount <= es.maxSupply, "Max supply is exceed");
        es.totalSupply += _amount;
        es.balance[_to] += _amount;
    }

    function spendAllowance(address owner, address spender, uint256 amount) internal
    {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max)
        {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            unchecked 
            {
                approve(owner, spender, currentAllowance - amount);
            }
        }
    }
}