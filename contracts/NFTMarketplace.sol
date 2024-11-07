// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IGrantContract {
    function getAllowance(address user) external view returns (uint256);
    function decrementAllowanceAndBurnIfExhausted(address user) external;
}

contract NFTMarketplace is ERC721URIStorage, ReentrancyGuard {
    uint256 private _tokenIds; // Manual token ID counter
    uint256 private _itemsSold; // Manual sold items counter
    uint256 public listingPrice = 0.00025 ether;
    uint256 public totalFees = 0;

    address payable public owner;
    address public marketplaceAddress;
    address public adminAddress;

    IGrantContract public grantContract;

    mapping(uint256 => MarketItem) private idToMarketItem;
    mapping(address => uint256) private pendingWithdrawals; // Track funds for withdrawal

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    event MarketItemCreated(uint256 indexed tokenId, address seller, address owner, uint256 price, bool sold);
    event TokenCreated(uint256 indexed tokenId, address owner);
    event MarketItemSold(uint256 indexed tokenId, address seller, address buyer, uint256 price);
    event MarketItemRelisted(uint256 indexed tokenId, address seller, uint256 price);
    event MarketItemRemoved(uint256 indexed tokenId, address seller);
    event MarketItemPriceUpdated(uint256 indexed tokenId, address seller, uint256 newPrice);
    event FundsWithdrawn(address indexed seller, uint256 amount);
    event MarketItemTransferred(uint256 indexed tokenId, address from, address to); // Event declaration
    event FeesWithdrawn(address indexed user, uint256 amount);
    event MarketItemBurned(uint256 indexed tokenId, address indexed owner);
    event MarketplaceAddressSet(address indexed marketplaceAddress);
    event AdminAddressSet(address indexed adminAddress);

    constructor() ERC721("NFT Marketplace", "NFTM") {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Only the owner can perform this action");
        _;
    }

    modifier onlyMarketplaceOrAdmin() {
        require(
            msg.sender == marketplaceAddress || msg.sender == adminAddress,
            "Not authorized"
        );
        _;
    }

    // Set the marketplace address (can only be called by the contract owner)
    function setMarketplaceAddress(address _marketplaceAddress) external onlyOwner {
        require(_marketplaceAddress != address(0), "Invalid marketplace address");
        marketplaceAddress = _marketplaceAddress;
        emit MarketplaceAddressSet(_marketplaceAddress);
    }

    // Set the admin address (can only be called by the contract owner)
    function setAdminAddress(address _adminAddress) external onlyOwner {
        require(_adminAddress != address(0), "Invalid admin address");
        adminAddress = _adminAddress;
        emit AdminAddressSet(_adminAddress);
    }

    // Function to set the Grant Contract address
    function setGrantContract(address _grantContract) external onlyOwner {
        grantContract = IGrantContract(_grantContract);
    }

    // Update listing price, only owner can do this
    function updateListingPrice(uint256 _listingPrice) public onlyOwner {
        listingPrice = _listingPrice;
    }

    // Get listing price
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    // Function to create a token and list it on the marketplace
    function createToken(string memory tokenURI, uint256 price) public payable returns (uint256) {
        require(msg.value == listingPrice, "Insufficient listing price");

        // Check if the user has allowance from the grant contract
        uint256 allowance = grantContract.getAllowance(msg.sender);
        require(allowance > 0, "No grant allowance available");

        _tokenIds += 1;  // Manually increment the token ID
        uint256 newTokenId = _tokenIds;

        _mint(msg.sender, newTokenId);  // Mint the token
        _setTokenURI(newTokenId, tokenURI);  // Set token metadata URI

        createMarketItem(newTokenId, price);  // Create market item

        // After creating the token, decrement the user's grant allowance
        grantContract.decrementAllowanceAndBurnIfExhausted(msg.sender);
        totalFees += listingPrice;

        emit TokenCreated(newTokenId, msg.sender); // Emit token creation event

        return newTokenId;
    }

    function createMarketItem(uint256 tokenId, uint256 price) private {
        require(price > 0, "Price must be at least 1");
        require(msg.value == listingPrice, "Price must be equal to listing price");

        idToMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)), // Owner is the contract
            price,
            false // Item is initially unsold
        );

        _transfer(msg.sender, address(this), tokenId);

        emit MarketItemCreated(tokenId, msg.sender, address(this), price, false);
    }

    // Function to allow seller to withdraw funds after a sale
        function withdrawFunds() public nonReentrant {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No funds to withdraw");

        // Update the balance before transferring (Checks-Effects-Interactions pattern)
        pendingWithdrawals[msg.sender] = 0;

        // Use call to transfer funds and handle errors
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");

        emit FundsWithdrawn(msg.sender, amount);
    }

    // Withdraw accumulated fees for the owner only, with reentrancy guard and failure handling
    function withdrawFees() public onlyOwner nonReentrant {
        require(totalFees > 0, "No fees to withdraw");

        uint256 amount = totalFees;
        totalFees = 0;  // Update state before transfer to prevent reentrancy attacks

        // Use call to transfer fees and handle errors
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Fee withdrawal failed");

        emit FeesWithdrawn(owner, amount);
    }

    // Function to remove an NFT from the marketplace
    function removeMarketItem(uint256 tokenId) public {
        require(idToMarketItem[tokenId].seller == msg.sender, "Only the seller can remove this item");
        require(idToMarketItem[tokenId].sold == false, "Item has already been sold");
        require(ownerOf(tokenId) == address(this), "Marketplace no longer owns this NFT");

        _transfer(address(this), msg.sender, tokenId); // Return NFT to seller

        delete idToMarketItem[tokenId]; // Remove from market item listings

        emit MarketItemRemoved(tokenId, msg.sender);
    }

    // Function to allow the seller to change the price of their listed NFT
    function changePrice(uint256 tokenId, uint256 newPrice) public {
        require(idToMarketItem[tokenId].seller == msg.sender, "Only the seller can change the price");
        require(newPrice > 0, "Price must be greater than zero");
        require(idToMarketItem[tokenId].sold == false, "Item has already been sold");

        idToMarketItem[tokenId].price = newPrice;

        emit MarketItemPriceUpdated(tokenId, msg.sender, newPrice);
    }

    // Function to allow resale of an owned NFT
    function resellToken(uint256 tokenId, uint256 price) public payable {
        require(idToMarketItem[tokenId].owner == msg.sender, "Only the owner can perform this operation");
        require(msg.value == listingPrice, "Price must be equal to the listing price");
        require(ownerOf(tokenId) == msg.sender, "Caller no longer owns this NFT");

        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].seller = payable(msg.sender); // Set caller as seller
        idToMarketItem[tokenId].owner = payable(address(this)); // Contract temporarily owns the NFT

        _itemsSold -= 1; // Decrement sold item counter

        _transfer(msg.sender, address(this), tokenId); // Transfer token back to contract for resell

        emit MarketItemRelisted(tokenId, msg.sender, price);
    }

    // Function to create a market sale (buy an NFT)
    function createMarketSale(uint256 tokenId) public payable {
        uint256 price = idToMarketItem[tokenId].price;
        require(msg.value == price, "Please submit the asking price");
        require(ownerOf(tokenId) == address(this), "Marketplace no longer owns this NFT");

        address payable seller = idToMarketItem[tokenId].seller;

        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
        idToMarketItem[tokenId].seller = payable(address(0));

        _itemsSold += 1;

        _transfer(address(this), msg.sender, tokenId);

        // Update pending funds for seller
        pendingWithdrawals[seller] += msg.value;

        payable(owner).transfer(listingPrice); // Transfer listing fee to marketplace owner

        emit MarketItemSold(tokenId, seller, msg.sender, price);
    }

    function internalTransferToken(address from, address to, uint256 tokenId) public {
        require(ownerOf(tokenId) == from, "Sender does not own this NFT");
        require(msg.sender == from || isApprovedForAll(from, msg.sender), "Caller is not owner nor approved");
        require(to != address(0), "Transfer to the burn address not allowed in internalTransferToken");

        // Update marketplace mappings
        idToMarketItem[tokenId].owner = payable(to);
        idToMarketItem[tokenId].seller = payable(from);
        idToMarketItem[tokenId].sold = false;

        emit MarketItemTransferred(tokenId, from, to);
    }

    function externalTransferUpdate(address from, address to, uint256 tokenId) public onlyMarketplaceOrAdmin {
        require(ownerOf(tokenId) == to, "Transfer not finalized on-chain");
        require(to != address(0), "Cannot update mapping for a burn event in externalTransferUpdate");

        // Update marketplace mappings
        idToMarketItem[tokenId].owner = payable(to);
        idToMarketItem[tokenId].seller = payable(from);
        idToMarketItem[tokenId].sold = false;

        emit MarketItemTransferred(tokenId, from, to);
    }

    function internalBurnToken(address from, uint256 tokenId) public {
        require(ownerOf(tokenId) == from, "Sender does not own this NFT");
        require(msg.sender == from || isApprovedForAll(from, msg.sender), "Caller is not owner nor approved");

        _burn(tokenId);  // Assuming _burn is implemented in ERC721

        delete idToMarketItem[tokenId];  // Remove from marketplace

        emit MarketItemBurned(tokenId, from);
    }

    function externalBurnUpdate(uint256 tokenId) public onlyMarketplaceOrAdmin {
        require(ownerOf(tokenId) == address(0), "Token is not burned on-chain");

        delete idToMarketItem[tokenId];  // Remove from marketplace

        emit MarketItemBurned(tokenId, msg.sender);
    }



    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _tokenIds;
        uint unsoldItemCount = _tokenIds - _itemsSold;
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);

        for (uint i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(this)) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint totalItemCount = _tokenIds;
        uint itemCount = 0;
        uint currentIndex = 0;

        for(uint i = 0; i < totalItemCount; i++) {
            if(idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);

        for(uint i = 0; i < totalItemCount; i++) {
            if(idToMarketItem[i + 1].owner == msg.sender) {
                uint currentId = i + 1;

                MarketItem storage currentItem = idToMarketItem[currentId];

                items[currentIndex] = currentItem;

                currentIndex += 1;
            }
        }

        return items;
    }

    function fetchItemsListed() public view returns (MarketItem[] memory) {
        uint totalItemCount = _tokenIds;
        uint itemCount = 0;
        uint currentIndex = 0;

        for(uint i = 0; i < totalItemCount; i++) {
            if(idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);

        for(uint i = 0; i < totalItemCount; i++) {
            if(idToMarketItem[i + 1].seller == msg.sender) {
                uint currentId = i + 1;

                MarketItem storage currentItem = idToMarketItem[currentId];

                items[currentIndex] = currentItem;

                currentIndex += 1;
            }
        }

        return items;
    }
}
