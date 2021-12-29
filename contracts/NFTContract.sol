// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract NFTContract is ERC1155, Ownable {
    uint256 public constant ERACH = 0;
    uint256 public constant ORLAI = 1;
    uint256 public constant ODIALT = 2;
    address marketplaceAddress;

    constructor(address _marketplaceAddress)
        ERC1155("https://inzloc1b6zrv.usemoralis.com/{id}.json")
    {
        marketplaceAddress = _marketplaceAddress;
        // autmoatically mint tokens to the sender
        _mint(msg.sender, ERACH, 10, "");
        _mint(msg.sender, ORLAI, 10, "");
        _mint(msg.sender, ODIALT, 10, "");
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount
    ) public onlyOwner {
        _mint(account, id, amount, "");
        // marketplace can oprate on token
        setApprovalForAll(marketplaceAddress, true);
    }

    function burn(
        address account,
        uint256 id,
        uint256 amount
    ) public onlyOwner {
        require(msg.sender == account);
        _burn(account, id, amount);
    }
}
