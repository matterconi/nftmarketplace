// contexts/GrantContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { GrantAddress, GrantAddressABI } from './constants';

const GrantContext = createContext();

export const useGrant = () => {
  return useContext(GrantContext);
};

export const GrantProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState('');

  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          const web3Signer = await web3Provider.getSigner();
          const address = await web3Signer.getAddress();

          console.log("Web3 Provider:", web3Provider);
          console.log("Web3 Signer:", web3Signer);
          console.log("User Address:", address);

          setProvider(web3Provider);
          setSigner(web3Signer);
          setUserAddress(address);

          // Initialize contract instance
          if (GrantAddress && GrantAddressABI) {
            const grantContract = new ethers.Contract(GrantAddress, GrantAddressABI, web3Signer);
            setContract(grantContract);
            console.log("Contract initialized:", grantContract);
          } else {
            console.error("GrantAddress or GrantAddressABI is undefined");
          }

          // Listen for account changes
          window.ethereum.on('accountsChanged', async (accounts) => {
            if (accounts.length > 0) {
              const newAddress = accounts[0];
              setUserAddress(newAddress);
              const newSigner = await web3Provider.getSigner();
              setSigner(newSigner);
              const newGrantContract = new ethers.Contract(GrantAddress, GrantAddressABI, newSigner);
              setContract(newGrantContract);
              console.log("Contract re-initialized with new signer:", newGrantContract);
            } else {
              setUserAddress('');
              setContract(null);
              alert('Please connect to MetaMask.');
            }
          });

        } catch (error) {
          console.error("Failed to initialize provider or signer:", error);
          alert('Failed to connect to MetaMask.');
        }
      } else {
        alert('Please install MetaMask!');
      }
    };
    initProvider();
  }, []);

  if(!contract) return null;

  /**
   * Function to purchase a Grant NFT.
   * @param {number} tier - The tier of the grant (1, 2, or 3).
   * @returns {Promise<ethers.Transaction>} - The transaction object.
   */
  const purchaseGrantNFT = async (tier) => {
    if (!contract) {
      console.error("Error: Contract not initialized");
      throw new Error("Contract not initialized");
    }

    console.log("purchaseGrantNFT called with tier:", tier);

    let price;
    if (tier === 1) price = ethers.parseEther('0.0000005');
    else if (tier === 2) price = ethers.parseEther('0.0000007');
    else if (tier === 3) price = ethers.parseEther('0.0000009');
    else throw new Error("Invalid tier selected.");

    console.log("Price calculated:", price.toString(), "for tier:", tier);

    try {
      console.log("Attempting to send transaction...");
      const tx = await contract.purchaseGrantNFT(tier, { value: price });
      console.log("Transaction sent successfully:", tx.hash);
      
      return tx;
    } catch (error) {
      console.error("Error in purchaseGrantNFT:", error);
      throw error;
    }
  };

  /**
   * Function to get the remaining allowance for a specific grant token ID.
   * @param {number} tokenId - The grant token ID.
   * @returns {Promise<string>} - The remaining allowance as a string.
   */
  const getRemainingAllowance = async (tokenId) => {
    if (!contract) {
      console.error("Error: Contract not initialized");
      throw new Error("Contract not initialized");
    }

    try {
      const allowance = await contract.grantToAllowance(tokenId);
      return allowance.toString();
    } catch (error) {
      console.error("Error in getRemainingAllowance:", error);
      throw error;
    }
  };

  /**
   * Function to retrieve the URIs for each tier from the contract.
   * @returns {Promise<string[]>} - An array of URIs for tiers 1, 2, and 3.
   */
  const getUri = async () => {
    if (!contract) {
      console.error("Error: Contract not initialized");
      throw new Error("Contract not initialized");
    }
  
    try {
      // Retrieve URIs for each tier
      const tier1Uri = await contract.getTokenURIForTier(1);
      const tier2Uri = await contract.getTokenURIForTier(2);
      const tier3Uri = await contract.getTokenURIForTier(3);
  
      const uris = [tier1Uri, tier2Uri, tier3Uri];
      console.log("Retrieved URIs from contract:", uris);
  
      return uris;
    } catch (error) {
      console.error("Error fetching URIs:", error);
      throw error;
    }
  };

  /**
   * Function to fetch all grant token IDs and their allowances for the connected user.
   * @returns {Promise<{tokenId: number, allowance: number}[]>} - Array of grant objects.
   */
  const getUserGrants = async () => {
    if (!contract) {
      console.error("Error: Contract not initialized");
      throw new Error("Contract not initialized");
    }

    try {
      const [grantIds, allowances] = await contract.getUserGrants(userAddress);
      const userGrants = grantIds.map((id, index) => ({
        tokenId: id.toNumber(),
        allowance: allowances[index].toNumber(),
      }));
      console.log("User Grants:", userGrants);
      return userGrants;
    } catch (error) {
      console.error("Error fetching user grants:", error);
      throw error;
    }
  };

  /**
   * Function to fetch all NFT token IDs owned by the connected user.
   * @returns {Promise<number[]>} - Array of NFT token IDs.
   */
  const getMyNFTs = async () => {
    if (!contract) {
      console.error("Error: Contract not initialized");
      throw new Error("Contract not initialized");
    }

    try {
      const nftIds = await contract.getMyNFTs();
      return nftIds;
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      throw error;
    }
  };

  return (
    <GrantContext.Provider value={{ 
      purchaseGrantNFT, 
      getRemainingAllowance, 
      getUri,
      getUserGrants,
      getMyNFTs,
      userAddress
    }}>
      {children}
    </GrantContext.Provider>
  );
};
