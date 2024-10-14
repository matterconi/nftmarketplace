'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Banner from '../components/Banner';
import CreatorCard from '../components/CreatorCard';
import NFTCard from '../components/NFTCard';
import { makeId } from '../utils/makeId';

import images from '../assets';

const Home = () => {
  const [hideLeftButton, setHideLeftButton] = useState(true);
  const [hideRightButton, setHideRightButton] = useState(false);
  const { theme } = useTheme();
  const scrollRef = useRef(null); // Only using scrollRef

  const handleScroll = (direction) => {
    const { current } = scrollRef;
    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

    if (direction === 'left') {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      
      // Hide left button if scrolled to the start
      setHideLeftButton(scrollLeft <= 0);
      
      // Hide right button if scrolled to the end
      setHideRightButton(scrollLeft + clientWidth >= scrollWidth);
    }
  };

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
  }, []);

  return (
    <div className="pt-65">
      <div className="flex justify-center sm:px-4 p-12">
        <div className="w-full minmd:w-4/5">
          <Banner 
            name="Discover, collect, and sell extraordinary NFTs"
            parentStyles="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
            childStyles="md:text-4xl sm:text-2xl xs:text-xl text-left"
          />
        </div>
      </div>
      <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4">
        Best Creators
      </h1>
      <div className="relative flex-1 max-w-full flex mt-3">
        <div className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none" ref={scrollRef}>
          {[6, 7, 8, 9, 10].map((item) => (
            <CreatorCard
              key={item}
              rank={item}
              creatorImage={images[`creator${item}`]}
              creatorName={`0x${makeId(3)}...${makeId(4)}`}
              creatorEths={10 - item * 0.43}
            />
          ))}
        </div>
        {!hideLeftButton && (
          <div className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-1/2 transform -translate-y-1/2 cursor-pointer left-0" onClick={() => handleScroll('left')}>
            <Image src={images.left} layout="fill" style={{ objectFit: 'contain' }} alt="left_arrow" className={theme === 'light' ? 'filter invert' : ''} />
          </div>
        )}
        {!hideRightButton && (
          <div className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-1/2 transform -translate-y-1/2 cursor-pointer right-0" onClick={() => handleScroll('right')}>
            <Image src={images.right} layout="fill" style={{ objectFit: 'contain' }} alt="right_arrow" className={theme === 'light' ? 'filter invert' : ''} />
          </div>
        )}
      </div>

      <div className="mt-10">
        <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
          <h1 className="flex-1 before:first:font-poppins font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4">Hot Bids</h1>
          <div>SearchBar</div>
        </div>
        <div className='mt-3 w-full flex flex-wrap justify-start md:justify-center'>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <NFTCard
              key={i}
              nft={{
                i,
                name: `NFT ${i}`,
                price: ((10 - i) * 0.534).toFixed(2),
                seller: `0x${makeId(3)}...${makeId(4)}`,
                owner: `0x${makeId(3)}...${makeId(4)}`,
                description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.`,
              }}
            />
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Home;
