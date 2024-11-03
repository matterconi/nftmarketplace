// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GrantNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    // Mapping from user address to array of their grant token IDs
    mapping(address => uint256[]) private userGrants;

    // Mapping from grant token ID to remaining allowance
    mapping(uint256 => uint256) public grantToAllowance;

    // Address of the authorized contract that can decrement allowances
    address public authorizedContract;

    // Placeholder URIs for each tier
    string public constant TIER_1_URI = "https://beige-advisory-marten-375.mypinata.cloud/ipfs/QmQtmNHkZgJqChtamNRMSqzDNDZBudfeQw6mtGR9nsY6Bg";
    string public constant TIER_2_URI = "https://beige-advisory-marten-375.mypinata.cloud/ipfs/QmeLdBHaCWzxgo4VFxQehmqGiwr9jQWPybJamJZobxyTXC";
    string public constant TIER_3_URI = "https://beige-advisory-marten-375.mypinata.cloud/ipfs/QmdnBHaztJGTQ87qi8u8sA7AEfWJVWwLweFextXHJL32aV";

    // Prices for each tier
    uint256 public constant TIER_1_PRICE = 5 ether;
    uint256 public constant TIER_2_PRICE = 7 ether;
    uint256 public constant TIER_3_PRICE = 10 ether;

    // Allowances for each tier
    uint256 public constant TIER_1_ALLOWANCE = 3;
    uint256 public constant TIER_2_ALLOWANCE = 5;
    uint256 public constant TIER_3_ALLOWANCE = 10;

    // Events
    event GrantMinted(uint256 indexed tokenId, address indexed owner, uint256 allowance);
    event Withdrawn(address indexed owner, uint256 amount);
    event AuthorizedContractSet(address indexed authorizedContract);
    event GrantBurned(uint256 indexed tokenId, address indexed owner);

    constructor() ERC721("SoulboundNFT", "SBT") Ownable(msg.sender) {}

    modifier onlyAuthorizedContract() {
        require(msg.sender == authorizedContract, "Caller is not the authorized contract");
        _;
    }

    // Set the authorized contract address, only owner can call this
    function setAuthorizedContract(address _authorizedContract) external onlyOwner {
        require(_authorizedContract != address(0), "Invalid address");
        authorizedContract = _authorizedContract;
        emit AuthorizedContractSet(_authorizedContract);
    }

    // Purchase a grant NFT (only one grant per purchase)
    function purchaseGrantNFT(uint8 tier) public payable {
        require(tier >= 1 && tier <= 3, "Invalid tier selected");

        uint256 price;
        uint256 allowance;

        if (tier == 1) {
            price = TIER_1_PRICE;
            allowance = TIER_1_ALLOWANCE;
        } else if (tier == 2) {
            price = TIER_2_PRICE;
            allowance = TIER_2_ALLOWANCE;
        } else {
            price = TIER_3_PRICE;
            allowance = TIER_3_ALLOWANCE;
        }

        require(msg.value == price, "Incorrect payment amount");

        _tokenIds += 1;
        uint256 newGrantId = _tokenIds;

        _safeMint(msg.sender, newGrantId);
        _setTokenURI(newGrantId, getTokenURIForTier(tier));
        grantToAllowance[newGrantId] = allowance;
        userGrants[msg.sender].push(newGrantId);

        emit GrantMinted(newGrantId, msg.sender, allowance);
    }

    // Decrement allowance and auto-burn if exhausted (only callable by authorized contract)
    function decrementAllowance(address user) external onlyAuthorizedContract {
        uint256[] storage grants = userGrants[user];
        require(grants.length > 0, "User does not own any grants");

        for (uint256 i = 0; i < grants.length; i++) {
            uint256 tokenId = grants[i];

            if (grantToAllowance[tokenId] > 0) {
                grantToAllowance[tokenId] -= 1;

                // If allowance is exhausted, burn the grant
                if (grantToAllowance[tokenId] == 0) {
                    _burn(tokenId);
                    emit GrantBurned(tokenId, user);

                    // Remove the tokenId from the user's grants array
                    grants[i] = grants[grants.length - 1];
                    grants.pop();
                }

                return; // Decrement only one grant per call
            }
        }

        revert("No minting rights left for user");
    }

    // Get all grant token IDs and their allowances for a user
    function getUserGrants(address user) external view returns (uint256[] memory, uint256[] memory) {
        uint256[] memory grants = userGrants[user];
        uint256[] memory allowances = new uint256[](grants.length);

        for (uint256 i = 0; i < grants.length; i++) {
            allowances[i] = grantToAllowance[grants[i]];
        }

        return (grants, allowances);
    }

    // Get all NFTs minted by the caller
    function getMyNFTs() public view returns (uint256[] memory, string[] memory) {
    uint256 totalSupply = _tokenIds;
    uint256 userNFTCount = balanceOf(msg.sender);
    uint256 currentIndex = 0;

    uint256[] memory userNFTs = new uint256[](userNFTCount);
    string[] memory uris = new string[](userNFTCount);

    for (uint256 i = 1; i <= totalSupply; i++) {
        if (ownerOf(i) == msg.sender) {
            userNFTs[currentIndex] = i;
            uris[currentIndex] = tokenURI(i);
            currentIndex += 1;
            if (currentIndex == userNFTCount) {
                break; // Exit early if all user's NFTs are found
            }
        }
    }

    return (userNFTs, uris);
}


    // Helper function to retrieve URI based on tier
    function getTokenURIForTier(uint8 tier) public pure returns (string memory) {
        if (tier == 1) return TIER_1_URI;
        if (tier == 2) return TIER_2_URI;
        if (tier == 3) return TIER_3_URI;
        revert("Invalid tier selected");
    }

    // Withdraw contract balance to owner
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");

        emit Withdrawn(owner(), balance);
    }

    // Override _update function to restrict transfers
    function _update(address to, uint256 tokenId, address auth) internal override(ERC721) returns (address) {
        address from = _ownerOf(tokenId);
        // Prevent transfers by allowing updates only if 'from' or 'to' is the zero address
        if (from != address(0) && to != address(0)) {
            revert("Soulbound: Transfer failed");
        }

        return super._update(to, tokenId, auth);
    }
}
