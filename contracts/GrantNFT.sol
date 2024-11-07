// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


contract GrantNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _tokenIds;
    address public marketplaceAddress;
    address public adminAddress;
    
    // Mapping from user address to array of their grant token IDs
    mapping(address => uint256[]) private userGrants;

    // Mapping from grant token ID to remaining allowance
    mapping(uint256 => uint256) public grantToAllowance;

    // Address of the NFTMarketplace contract, which is allowed to decrement allowances
    address public nftMarketplace;

    // Placeholder URIs for each tier
    string public constant TIER_1_URI = "https://beige-advisory-marten-375.mypinata.cloud/ipfs/QmQtmNHkZgJqChtamNRMSqzDNDZBudfeQw6mtGR9nsY6Bg";
    string public constant TIER_2_URI = "https://beige-advisory-marten-375.mypinata.cloud/ipfs/QmeLdBHaCWzxgo4VFxQehmqGiwr9jQWPybJamJZobxyTXC";
    string public constant TIER_3_URI = "https://beige-advisory-marten-375.mypinata.cloud/ipfs/QmdnBHaztJGTQ87qi8u8sA7AEfWJVWwLweFextXHJL32aV";

    // Prices and allowances for each tier
    uint256 public constant TIER_1_PRICE = 0.0000005 ether;
    uint256 public constant TIER_2_PRICE = 0.0000007 ether;
    uint256 public constant TIER_3_PRICE = 0.0000009 ether;
    uint256 public constant TIER_1_ALLOWANCE = 1;
    uint256 public constant TIER_2_ALLOWANCE = 2;
    uint256 public constant TIER_3_ALLOWANCE = 3;

    // Events
    event GrantMinted(uint256 indexed tokenId, address indexed owner, uint256 allowance);
    event GrantBurned(uint256 indexed tokenId, address indexed owner);
    event Withdrawn(address indexed owner, uint256 amount);
    event MarketplaceAddressSet(address indexed marketplaceAddress);
    event AdminAddressSet(address indexed adminAddress);

    constructor() ERC721("GrantNFT", "GNT") Ownable(msg.sender) {}

    // Modifier to allow only the NFTMarketplace contract to call specific functions
    modifier onlyMarketplace() {
        require(msg.sender == nftMarketplace, "Caller is not the NFTMarketplace contract");
        _;
    }

    modifier onlyMarketplaceOrAdmin() {
        require(
            msg.sender == marketplaceAddress || msg.sender == adminAddress,
            "Not authorized"
        );
        _;
    }

    // Set the address of the NFTMarketplace contract
    function setMarketplaceAddress(address _nftMarketplace) external onlyOwner {
        require(_nftMarketplace != address(0), "Invalid address");
        nftMarketplace = _nftMarketplace;
        emit MarketplaceAddressSet(_nftMarketplace);
    }

    function setAdminAddress(address _adminAddress) external onlyOwner {
        require(_adminAddress != address(0), "Invalid admin address");
        adminAddress = _adminAddress;
        emit AdminAddressSet(_adminAddress);
    }

    // Purchase a grant NFT based on tier and add it to user's grant array
    function purchaseGrantNFT(uint8 tier) public payable {
        require(tier >= 1 && tier <= 3, "Invalid tier selected");

        uint256 price = (tier == 1) ? TIER_1_PRICE : (tier == 2) ? TIER_2_PRICE : TIER_3_PRICE;
        uint256 allowance = (tier == 1) ? TIER_1_ALLOWANCE : (tier == 2) ? TIER_2_ALLOWANCE : TIER_3_ALLOWANCE;
        require(msg.value == price, "Incorrect payment amount");

        _tokenIds += 1;
        uint256 newGrantId = _tokenIds;

        _safeMint(msg.sender, newGrantId);
        _setTokenURI(newGrantId, getTokenURIForTier(tier));
        grantToAllowance[newGrantId] = allowance;

        // Add the new grant ID to the user's array
        userGrants[msg.sender].push(newGrantId);

        emit GrantMinted(newGrantId, msg.sender, allowance);
    }

    // Retrieve total remaining allowance for a user (restricted to marketplace contract)
    function getAllowance(address user) external view onlyMarketplace returns (uint256) {
        uint256[] storage grants = userGrants[user];
        uint256 totalAllowance = 0;

        for (uint256 i = 0; i < grants.length; i++) {
            uint256 tokenId = grants[i];

            // Count allowance only if the user still owns the grant
            if (ownerOf(tokenId) == user) {
                totalAllowance += grantToAllowance[tokenId];
            }
        }

        return totalAllowance;
    }

    // Decrement the allowance for a user's grant and burn if exhausted (restricted to marketplace contract)
    function decrementAllowanceAndBurnIfExhausted(address user) external onlyMarketplace {
        uint256[] storage grants = userGrants[user];
        require(grants.length > 0, "User does not own any grants");

        for (uint256 i = 0; i < grants.length; i++) {
            uint256 tokenId = grants[i];

            // Verify the user is still the owner of the grant
            if (ownerOf(tokenId) != user) {
                // If the user no longer owns this grant, remove it from their array
                grants[i] = grants[grants.length - 1];
                grants.pop();
                i--; // Adjust index to recheck at the current position
                continue;
            }

            // If the grant has allowance, decrement it
            if (grantToAllowance[tokenId] > 0) {
                grantToAllowance[tokenId] -= 1;

                // Burn the grant NFT if allowance reaches zero
                if (grantToAllowance[tokenId] == 0) {
                    _burn(tokenId);
                    emit GrantBurned(tokenId, user);

                    // Remove burned grant ID from user's array by replacing it with the last element
                    grants[i] = grants[grants.length - 1];
                    grants.pop();
                }

                return; // Stop after decrementing one grant
            }
        }

        revert("No allowance left for user grants");
    }

    // Helper function to retrieve URI based on tier
    function getTokenURIForTier(uint8 tier) public pure returns (string memory) {
        if (tier == 1) return TIER_1_URI;
        if (tier == 2) return TIER_2_URI;
        if (tier == 3) return TIER_3_URI;
        revert("Invalid tier selected");
    }

    // Withdraw contract balance to owner
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");

        emit Withdrawn(owner(), balance);
    }

    function _update(address to, uint256 tokenId, address auth) internal override(ERC721) returns (address) {
        address from = _ownerOf(tokenId);
        // Prevent transfers by allowing updates only if 'from' or 'to' is the zero address
        if (from != address(0) && to != address(0)) {
            revert("Soulbound: Transfer failed");
        }

        return super._update(to, tokenId, auth);
    }
}



