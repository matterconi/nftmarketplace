'use client';

import { useState, useEffect, useContext, useMemo } from 'react';
import Image from 'next/image';
import { NFTContext } from '../../context/NFTContext';
import NFTCard from '@/components/NFTCard';
import Loading from '@/components/Loading';
import Banner from '@/components/Banner';
import SearchBar from '@/components/SearchBar';

import images from '../../assets';
import { shortenAddress } from '@/utils/shortenAddress';

const MyNFTs = () => {
    const { fetchMyNFTsOrListedNFTs, currentAccount } = useContext(NFTContext);
    const [nfts, setNfts] = useState([]);
    const [nftsCopy, setNftsCopy] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSelect, setActiveSelect] = useState("Recently Added"); // Consistent naming
  
    useEffect(() => {
      const getNFTs = async () => {
        try {
          setIsLoading(true); // Start loading
          const items = await fetchMyNFTsOrListedNFTs();
          setNfts(items);
          setNftsCopy(items);
        } catch (error) {
          console.error("Error fetching NFTs:", error);
        } finally {
          setIsLoading(false); // End loading
        }
      };
      getNFTs();
    }, [fetchMyNFTsOrListedNFTs]);
  
    // Memoize sorted NFTs to optimize performance
    const sortedNfts = useMemo(() => {
      let sorted = [...nfts];
      switch (activeSelect) {
        case "Price (low to high)":
          sorted.sort((a, b) => Number(a.price) - Number(b.price));
          break;
        case "Price (high to low)":
          sorted.sort((a, b) => Number(b.price) - Number(a.price));
          break;
        case "Recently Added":
          sorted.sort((a, b) => b.tokenId - a.tokenId);
          break;
        default:
          break;
      }
      return sorted;
    }, [activeSelect, nfts]);
  
    const onHandleSearch = (value) => {
      const filteredNfts = nftsCopy.filter(({ name }) =>
        name.toLowerCase().includes(value.toLowerCase())
      );
  
      if (filteredNfts.length) {
        setNfts(filteredNfts);
      } else {
        setNfts(nftsCopy);
      }
    };
  
    const onClearSearch = () => {
      if (nftsCopy.length) {
        setNfts(nftsCopy);
      }
    };
  
    if (isLoading) {
      return (
        <div className='flexStart min-h-screen'>
          <Loading />
        </div>
      );
    }
  
    return (
      <div className='w-full flex justify-start items-center flex-col min-h-screen'>
        <div className='w-full flexCenter flex-col'>
          <Banner
            name='Your Nifty NFTs'
            childStyles='text-center mb-4'
            parentStyles='h-80 justify-center'
          />
  
          <div className='flexCenter flex-col -mt-20 z-0'>
            <div className='flexCenter w-40 h-40 sm:w-36 sm:h-36 p-1 bg-nft-black-2 rounded-full'>
              <Image
                src={images.creator1}
                className='rounded-full object-cover'
                alt="creator_image"
                width={160}
                height={160}
              />
            </div>
            <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl mt-6'>
              {shortenAddress(currentAccount)}
            </p>
          </div>
        </div>
  
        {!isLoading && !nfts.length && !nftsCopy.length ? (
          <div className='flexCenter sm:p-4 p-16'>
            <h1 className='font-poppins dark:text-white text-nft-black-1 font-extrabold text-3xl'>
              No NFTs Owned
            </h1>
          </div>
        ) : (
          <div className='sm:px-4 p-12 w-full minmd:w-4/5 flexCenter flex-col'>
            <div className='flex-1 w-full flex flex-row sm:flex-col px-4 xs:px-0 minlg:px-8'>
              <SearchBar
                activeSelect={activeSelect}
                setActiveSelect={setActiveSelect}
                handleSearch={onHandleSearch}
                clearSearch={onClearSearch}
              />
            </div>
            <div className='mt-3 w-full flex flex-wrap'>
              {sortedNfts.map((nft) => (
                <NFTCard key={nft.tokenId} nft={nft} onProfilePage />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default MyNFTs;
