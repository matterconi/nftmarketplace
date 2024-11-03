import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal'; 
import { ethers } from 'ethers';
import axios from 'axios';
import { MarketAddress, MarketAddressABI } from './constants';

const fetchContract = (signerOrProvider) => {
  return new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);
};

export const NFTContext = React.createContext();

export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const nftCurrency = 'MATIC';
  const [isLoadingNFT, setIsLoadingNFT] = useState(false);

  const fetchNFTs = async () => {
    try {
        setIsLoadingNFT(false); //); //
        // Initialize the provider to connect to localhost
        const provider = new ethers.JsonRpcProvider();
        
        // Connect to the deployed contract
        const contract = fetchContract(provider);
        
        // Fetch all unsold market items
        const data = await contract.fetchMarketItems();
        
        // Process each MarketItem to extract detailed NFT information
        const items = await Promise.all(
            data.map(async (item) => {                
                // Extract properties from MarketItem
                const tokenId = item.tokenId.toString(); // Convert BigInt to string
                const seller = item.seller;
                const owner = item.owner;
                const price = ethers.formatEther(item.price); // Convert price from Wei to ETH
                const sold = item.sold;
                
                // Fetch the tokenURI from the contract
                const tokenURI = await contract.tokenURI(tokenId);                
                // Fetch the metadata from the tokenURI
                const meta = await axios.get(tokenURI);
                const { image, name, description } = meta.data;                
                return {
                    tokenId,
                    seller,
                    owner,
                    price,
                    sold,
                    image,
                    name,
                    description,
                    tokenURI
                };
            })
        );
        
        // Filter out any null items (if any)
        const filteredItems = items.filter(item => item !== null);
        return filteredItems;
    } catch (error) {
        console.error('Error fetching NFTs:', error);
        return [];
    }
};

 const fetchMyNFTsOrListedNFTs = async (type) => {
  setIsLoadingNFT(false);
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.BrowserProvider(connection); // ethers v6
  const signer = await provider.getSigner(); // Make sure signer is fetched correctly

  const contract = fetchContract(signer);

  const data = type === 'fetchItemsListed' 
  ? await contract.fetchItemsListed() 
  : await contract.fetchMyNFTs();

  const items = await Promise.all(
      data.map(async (item) => {
          
          // Extract properties from MarketItem
          const tokenId = item.tokenId.toString(); // Convert BigInt to string
          const seller = item.seller;
          const owner = item.owner;
          const price = ethers.formatEther(item.price); // Convert price from Wei to ETH
          const sold = item.sold;
          
          // Fetch the tokenURI from the contract
          const tokenURI = await contract.tokenURI(tokenId);
          // Fetch the metadata from the tokenURI
          const meta = await axios.get(tokenURI);
          const { image, name, description } = meta.data;
          return {
              tokenId,
              seller,
              owner,
              price,
              sold,
              image,
              name,
              description,
              tokenURI
          };
      })
  );
  return items;
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
    const transaction = !isReselling ? await contract.createToken(metadataUrl, price, { value: listingPrice.toString() }) : await contract.resellToken(id, price, { value: listingPrice.toString() });
    setIsLoadingNFT(true);
    await transaction.wait();
    setIsLoadingNFT(false);
  } catch (error) {
    console.error('Error creating sale:', error); // Better error logging
  }
};

const buyNFT = async (nft) => {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.BrowserProvider(connection); // ethers v6
  const signer = await provider.getSigner(); // Make sure signer is fetched correctly

  const contract = fetchContract(signer);

  const price = ethers.parseUnits(nft.price.toString(), 'ether'); // ethers v6 uses parseUnits

  const tokenId = BigInt(nft.tokenId);

  const transaction = await contract.createMarketSale(tokenId, { value: price });
  setIsLoadingNFT(true);
  await transaction.wait();
  setIsLoadingNFT(false);
}

const checkIfWalletIsConnect = async () => {
if (!window.ethereum) return alert('Please install MetaMask.');

const accounts = await window.ethereum.request({ method: 'eth_accounts' });

if (accounts.length) {
  setCurrentAccount(accounts[0]);
} else {
  console.log('No accounts found');
}
};

useEffect(() => {
checkIfWalletIsConnect();
}, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      console.log('MetaMask is required to connect your wallet.');
      return false;
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setCurrentAccount(accounts[0]);
  };

  const uploadToIPFS = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

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
      await createSale(metadataUrl, price);
      router.push('/');

    } catch (error) {
      console.error('Error creating NFT metadata:', error);

    }
  };

  return (
    <NFTContext.Provider value={{ nftCurrency, connectWallet, currentAccount, uploadToIPFS, createNFT, fetchNFTs, fetchMyNFTsOrListedNFTs, buyNFT, createSale, isLoadingNFT }}>
      {children}
    </NFTContext.Provider>
  );
};


