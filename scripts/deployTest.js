const hre = require('hardhat');

async function main() {
    // Fetch the contract factory for NFTStoriesTest
    const NFTStoriesTest = await hre.ethers.getContractFactory('NFTStoriesTest');
    
    // Deploy the contract
    const nftStoriesTest = await NFTStoriesTest.deploy();

    // Wait for the contract to be deployed
    await nftStoriesTest.waitForDeployment();

    // Log the contract address after successful deployment
    console.log('NFTStoriesTest deployed to:', await nftStoriesTest.getAddress());
}

main()
    .then(() => process.exit(0)) // Exit on success
    .catch((error) => {
        console.error('Error during contract deployment:', error);
        process.exit(1); // Exit with failure
    });
