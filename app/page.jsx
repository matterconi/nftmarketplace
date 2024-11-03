'use client';

import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';

import Banner from '../components/Banner';
import Button from '../components/Button';
import CreatorCard from '../components/CreatorCard';
import NFTCard from '../components/NFTCard';
import Loading from '../components/Loading'; 
import { NFTContext } from '../context/NFTContext';

import images from '../assets';
import { getCreators } from '@/utils/getTopCreator';
import { shortenAddress } from '@/utils/shortenAddress';
import SearchBar from '@/components/SearchBar';


const Home = () => {
  const { fetchNFTs } = useContext(NFTContext);
  const [hideLeftButton, setHideLeftButton] = useState(true);
  const [hideRightButton, setHideRightButton] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const [displayLimit, setDisplayLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const [hasMoreNFTs, setHasMoreNFTs] = useState(true);
  const scrollRef = useRef(null);

  const [activeSelect, setActiveSelect] = useState('Recently Listed');

  useEffect(() => {
    const getNFTs = async () => {
      setLoading(true);
      try {
        const data = await fetchNFTs(); // Full list fetched once
        setNftsCopy(data);
        setNfts(data.slice(0, displayLimit)); // Show initial set of NFTs
        setHasMoreNFTs(data.length > displayLimit);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        setHasMoreNFTs(false);
      } finally {
        setLoading(false);
      }
    };
    getNFTs();
  }, [fetchNFTs]);

  const onHandleSearch = (value) => {
    const filteredNfts = nftsCopy.filter(({ name }) =>
      name.toLowerCase().includes(value.toLowerCase())
    );
    setNfts(filteredNfts.length ? filteredNfts : nftsCopy);
  };

  const onClearSearch = () => setNfts(nftsCopy);

  const handleScroll = (direction) => {
    const { current } = scrollRef;
    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

    if (direction === 'left') {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
    checkScrollPosition();
  };

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      ('scrollLeft:', scrollLeft, scrollWidth, clientWidth);
      
      // Hide left button if scrolled to the start
      setHideLeftButton(scrollLeft <= 0);
      
      // Hide right button if scrolled to the end
      setHideRightButton(scrollLeft + clientWidth >= scrollWidth);
    }
  };

  const topCreators = getCreators(nfts);

  useEffect(() => {
    checkScrollPosition(); // Check position on mount
    window.addEventListener('resize', checkScrollPosition); // Recalculate on resize

    // Add scroll listener to track position dynamically
    if (scrollRef.current) {
      scrollRef.current.addEventListener('scroll', checkScrollPosition);
    }
    return () => {
      window.removeEventListener('resize', checkScrollPosition);
      if (scrollRef.current) {
        scrollRef.current.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, [topCreators]);

  const loadMoreNFTs = () => {
    const newLimit = displayLimit + 10;
    setNfts(nftsCopy.slice(0, newLimit));
    setDisplayLimit(newLimit);
    if (newLimit >= nftsCopy.length) {
      setHasMoreNFTs(false); // Disable "Load More" if all NFTs are displayed
    }
  };

  const sortedNfts = useMemo(() => {
    let sorted = [...nftsCopy];
    switch (activeSelect) {
      case "Price (low to high)":
        sorted.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "Price (high to low)":
        sorted.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "Recently Listed":
        sorted.sort((a, b) => b.tokenId - a.tokenId);
        break;
      default:
        break;
    }
    return sorted.slice(0, displayLimit);
  }, [activeSelect, nftsCopy, displayLimit]);



  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-8 p-12">
      <div className="w-full minmd:w-4/5">
        <div className="py-8 sm:py-10 md:py-12 lg:py-16">
          <Banner 
            name={<>Discover, collect, and sell <br /> extraordinary NFTs</>}
            parentStyles="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
            childStyles="md:text-4xl sm:text-2xl xs:text-xl text-left"
          />
        </div>

        {!loading && !nfts.length ? (
          <h1 className='font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0'>
            That's weird... No NFTs for sale!
          </h1>
        ) : loading ? (
          <Loading />
        ) : (
          <div className="py-8 sm:py-10 md:py-12 lg:py-16">
            <h1 className="font-poppins dark:text-white text-2xl minlg:text-4xl font-semibold mx-4 sm:mx-0">
              Top Sellers
            </h1>
            <div className="relative flex-1 max-w-full flex mt-3 overflow-hidden">
              <div className="flex flex-row w-max overflow-x-auto select-none scrollbar-hide" ref={scrollRef}>
                {topCreators && topCreators.map(({ creator, value }, index) => (
                  <CreatorCard
                    key={index}
                    rank={index + 1}
                    creatorImage={images[`creator${index + 1}`]}
                    creatorName={shortenAddress(creator)}
                    creatorEths={value}
                  />
                ))}
              </div>
              {!hideLeftButton && (
              <div className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-1/2 transform -translate-y-1/2 cursor-pointer left-0" onClick={() => handleScroll('left')}>
              <Image 
                src={images.left}  
                alt="left_arrow"
                style={{ objectFit: 'contain' }}
                className={theme === 'light' ? 'filter invert' : ''}
              />
              </div>
            )}
            {!hideRightButton && (
              <div className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-1/2 transform -translate-y-1/2 cursor-pointer right-0" onClick={() => handleScroll('right')}>
                <Image src={images.right} style={{ objectFit: 'contain' }} alt="right_arrow" className={theme === 'light' ? 'filter invert' : ''} />
              </div>
            )}
            </div>
          </div>
        )}

        <div className="py-8 sm:py-10 md:py-12 lg:py-16">
          <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
            <h1 className="flex-1 font-poppins dark:text-white text-2xl minlg:text-4xl font-semibold sm:mb-4">
              Shop NFTs
            </h1>
            <div className='flex-2 sm:w-full flex flex-row sm:flex-col'>
              <SearchBar
                activeSelect={activeSelect}
                setActiveSelect={setActiveSelect}
                handleSearch={onHandleSearch}
                clearSearch={onClearSearch}
              />
            </div>
          </div>
          {loading ? (
            <Loading />
          ) : sortedNfts.length > 0 ? (
            <div className='flex flex-col'>
              <div className='mt-3 w-full grid grid-cols-1 md:flex md:flex-wrap md:justify-center lg:flex lg:flex-wrap lg:justify-start'>{sortedNfts.slice(0, 10).map((nft) => (
                <NFTCard key={nft.tokenId} nft={nft} />
              ))}</div>
              {hasMoreNFTs && !loading && (
                <Button btnName="Load More NFTs" handleClick={loadMoreNFTs} classStyles="mt-8 rounded-full w-fit mx-auto"/>
              )}
            </div>
          ) : (
            <p className="text-center w-full text-gray-500">No NFTs available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
