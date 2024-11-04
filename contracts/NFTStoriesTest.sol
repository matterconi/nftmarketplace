// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NFTStoriesTest {
    uint256 public tokenCount;

    event TokenMinted(address indexed owner, uint256 tokenId);
    event TokenTransferred(address indexed from, address indexed to, uint256 tokenId);

    mapping(uint256 => address) public tokenOwners;

    function mintToken() public returns (uint256) {
        tokenCount++;
        uint256 newTokenId = tokenCount;

        tokenOwners[newTokenId] = msg.sender;
        emit TokenMinted(msg.sender, newTokenId);

        return newTokenId;
    }

    function transferToken(uint256 tokenId, address to) public {
        require(tokenOwners[tokenId] == msg.sender, "You are not the owner of this token");
        require(to != address(0), "Invalid address");

        emit TokenTransferred(msg.sender, to, tokenId);
        tokenOwners[tokenId] = to;
    }
}
