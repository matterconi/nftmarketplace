import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal'; 
import { ethers } from 'ethers';
import axios from 'axios';
import { MarketAddress, MarketAddressABI } from './constants';

const fetchContract = (signerOrProvider) => {
  return new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);
};

const createSale = async (metadataUrl, formInputPrice, isReselling = false, id = null) => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection); // ethers v6
      const signer = await provider.getSigner(); // Make sure signer is fetched correctly

      const price = ethers.parseUnits(formInputPrice, 'ether'); // ethers v6 uses parseUnits

      const contract = fetchContract(signer); 
      const listingPrice = await contract.getListingPrice();
      
      // Use metadataUrl instead of url
      const transaction = await contract.createToken(metadataUrl, price, { value: listingPrice.toString() });
      await transaction.wait();
    } catch (error) {
      console.error('Error creating sale:', error); // Better error logging
    }
  };

// context/NFTContext.js

// context/NFTContext.js

// context/NFTContext.js

export const fetchNFTs = async () => {
    try {
        const provider = new ethers.JsonRpcProvider(); // Specify the RPC URL if necessary
        const contract = fetchContract(provider);
        const data = await contract.fetchMarketItems();
        console.log('Raw Fetched Data:', data);

        const items = await Promise.all(
            data.map(async (item) => {
                console.log('Fetching NFT:', item);
                
                // Example of processing the item and returning a useful value
                const tokenId = item[0]; // Assuming item[0] is the tokenId in BigNumber format
                
                return {
                    tokenId,
                };
            })
        );

        const filteredItems = items.filter(item => item !== null);
        console.log('Processed NFTs:', filteredItems);
        return filteredItems;
    } catch (error) {
        console.error('Error fetching NFTs:', error);
        return [];
    }
};

  

export const NFTContext = React.createContext();

export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const nftCurrency = 'MATIC';

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) {
      console.log('MetaMask is required to connect your wallet.');
      return false;
    }
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log('Please connect your wallet to access the NFT Marketplace.');
      return false;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await checkIfWalletIsConnected();
    };
    initialize();
  }, [currentAccount]); // Ensure this runs after account is set

  const connectWallet = async () => {
    if (!window.ethereum) {
      console.log('MetaMask is required to connect your wallet.');
      return false;
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setCurrentAccount(accounts[0]);
    console.log('Connected account:', accounts[0]);
  };

  const uploadToIPFS = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    // Log the contents of the formData
    for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
    }


    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    try {
      const response = await axios.post(url, formData, {
        maxBodyLength: 'Infinity', 
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`, 
        },
      });

      const fileUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      console.log('Pinata File URL:', fileUrl); 
      return fileUrl;
    } catch (error) {
      console.error('Error uploading to Pinata:', error);
      return null;
    }
  };

  const createNFT = async (formInput, fileUrl, router) => {
    const { name, description, price } = formInput;

    if (!name || !description || !price || !fileUrl) {
      console.error('Missing fields. Please provide name, description, price, and fileUrl.');
      return;
    }

    const metadata = {
      name,
      description,
      image: fileUrl,
    };

    const data = JSON.stringify(metadata);

    try {
      const response = await axios.post(`https://api.pinata.cloud/pinning/pinJSONToIPFS`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`, 
        },
      });

      const metadataUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      console.log('Metadata IPFS URL:', metadataUrl);

      await createSale(metadataUrl, price);
      router.push('/');

    } catch (error) {
      console.error('Error creating NFT metadata:', error);

    }
  };

  return (
    <NFTContext.Provider value={{ nftCurrency, connectWallet, currentAccount, uploadToIPFS, createNFT, fetchNFTs }}>
      {children}
    </NFTContext.Provider>
  );
};
