const hre = require('hardhat');

async function main() {
    // Fetch the contract factory for GrantNFT
    const GrantNFT = await hre.ethers.getContractFactory('GrantNFT');
    
    // Deploy the contract
    const grantNFT = await GrantNFT.deploy();

    // Wait for the contract to be deployed
    await grantNFT.waitForDeployment();  // For ethers.js v5
    // If using ethers.js v6, use:
    // await grantNFT.waitForDeployment();

    // Log the contract address after successful deployment
    console.log('GrantNFT deployed to:', await grantNFT.getAddress());
}

main()
    .then(() => process.exit(0)) // Exit on success
    .catch((error) => {
        console.error('Error during contract deployment:', error);
        process.exit(1); // Exit with failure
    });
