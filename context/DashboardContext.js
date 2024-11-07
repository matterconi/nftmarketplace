import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { MarketAddress, MarketAddressABI, GrantAddress, GrantAddressABI } from './constants';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [marketplaceContract, setMarketplaceContract] = useState(null);
  const [grantContract, setGrantContract] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          const web3Signer = await web3Provider.getSigner();
          const address = await web3Signer.getAddress();

          setProvider(web3Provider);
          setSigner(web3Signer);
          setUserAddress(address);

          const marketContractInstance = new ethers.Contract(MarketAddress, MarketAddressABI, web3Signer);
          const grantContractInstance = new ethers.Contract(GrantAddress, GrantAddressABI, web3Signer);

          setMarketplaceContract(marketContractInstance);
          setGrantContract(grantContractInstance);

          // Check ownership for admin functions
          const marketOwner = await marketContractInstance.owner();
          setIsOwner(marketOwner.toLowerCase() === address.toLowerCase());
        } catch (error) {
          console.error("Error initializing provider:", error);
          alert("Failed to connect to MetaMask.");
        }
      } else {
        alert("Please install MetaMask!");
      }
    };
    initProvider();
  }, []);

  // Contract functions accessible only by the owner
  const setMarketplaceAddress = async (_nftMarketplace) => {
    if (!isOwner || !marketplaceContract) return;
    try {
      const tx = await grantContract.setMarketplaceAddress(_nftMarketplace);
      await tx.wait();
      console.log("Marketplace address set:", _nftMarketplace);
    } catch (error) {
      console.error("Error setting marketplace address:", error);
    }
  };

  const setAdminAddress = async (_adminAddress) => {
    if (!isOwner || !grantContract) return;
    try {
      const tx = await grantContract.setAdminAddress(_adminAddress);
      await tx.wait();
      console.log("Admin address set:", _adminAddress);
    } catch (error) {
      console.error("Error setting admin address:", error);
    }
  };

  const setGrantContractAddress = async (_grantAddress) => {
    if (!isOwner || !marketplaceContract) return;
    try {
      const tx = await marketplaceContract.setGrantContract(_grantAddress);
      await tx.wait();
      console.log("Grant contract address set:", _grantAddress);
    } catch (error) {
      console.error("Error setting grant contract address:", error);
    }
  };

  const updateListingPrice = async (_listingPrice) => {
    if (!isOwner || !marketplaceContract) return;
    try {
      const tx = await marketplaceContract.updateListingPrice(_listingPrice);
      await tx.wait();
      console.log("Listing price updated to:", _listingPrice);
    } catch (error) {
      console.error("Error updating listing price:", error);
    }
  };

  return (
    <DashboardContext.Provider value={{
      setMarketplaceAddress,
      setAdminAddress,
      setGrantContractAddress,
      updateListingPrice,
      isOwner,
      userAddress
    }}>
      {children}
    </DashboardContext.Provider>
  );
};
