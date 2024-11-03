'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import 'swiper/css/navigation'; // Import navigation styles
import { Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';

import tiers from '../data/tiers';
import Button from './Button';

const GrantCard = ({ metadata, tiers, classStyles, setPaymentModal, setTier, setNft, setIndex }) => {
  const [selectedTier, setSelectedTier] = useState(null);

  if (!metadata) return null;
  const handleClick = (index) => {
    setNft(metadata[index]);
    setTier(tiers[index]);
    setIndex(index + 1);
    setPaymentModal(true);
  };

  return (
    <div className="flex justify-center">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        centeredSlides={true}
        loop={true}
        pagination={{ clickable: true }}
        navigation
        className="h-full custom-swiper"
      >
        {tiers.map((tier, index) => (
          <SwiperSlide key={tier.id}>
            <div className="bg-white dark:bg-nft-black-3 rounded-2xl p-6 shadow-md flex flex-col items-center">
              {/* Tier Title and Description */}
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{metadata[index].name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{tier.nfts} NFTs for {tier.price} </p>

              <div className={`sm:w-[90vw] md:w-[70vw] w-[calc(100vw/4)] dark:bg-nft-black-3 bg-white rounded-2xl p-4 m-4`}>
                {/* Image Container */}
                <div className="relative w-full h-72 sm:h-36 xs:h-56 minmd:h-60 minlg:h-72 rounded-2xl overflow-hidden">
                  <Image
                    src={metadata[index].image}
                    fill
                    alt={metadata[index].name}
                    sizes="100%"
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* Name and Description */}
                <div className="mt-8">
                  <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-base">
                    {metadata[index].description}
                  </p>
                </div>
                <div className='flex flexCenter'>
                  <Button
                    btnName={`Buy Grant NFT for ${tier.price}`}
                    classStyles="mt-8 mx-auto rounded-full self-center"
                    handleClick={() => handleClick(index)}
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default GrantCard;
