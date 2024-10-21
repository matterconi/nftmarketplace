const hre = require('hardhat');

async function main() {
    // Fetch the contract factory for NFTMarketplace
    const NFTMarketplace = await hre.ethers.getContractFactory('NFTMarketplace');
    
    // Deploy the contract
    const nftMarketplace = await NFTMarketplace.deploy();

    // Wait for the contract to be deployed (v6 ethers.js syntax)
    await nftMarketplace.waitForDeployment();  // <-- This is the correct method in ethers.js v6

    // Log the contract address after successful deployment
    console.log('NFTMarketplace deployed to:', await nftMarketplace.getAddress());  // <-- Access the correct contract address
}

main()
    .then(() => process.exit(0)) // Exit on success
    .catch((error) => {
        console.error('Error during contract deployment:', error);
        process.exit(1); // Exit with failure
    });
