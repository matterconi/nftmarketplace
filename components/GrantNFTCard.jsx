// GrantNFTCard.jsx
'use client';

import Image from 'next/image';
import Button from './Button';

const GrantNFTCard = ({ metadata, tiers, classStyles, index, setPaymentModal, setTier, setNft, setIndex }) => {
  if (!metadata) return null;
  const handleClick = () => {
    setNft(metadata);
    setTier(tiers[index]);
    setIndex(index + 1);
    setPaymentModal(true);
  };

  return (
    <div className="w-[calc(100vw/4)] m-4 bg-white dark:bg-nft-black-3 rounded-2xl p-6 shadow-md flex flex-col justify-between">
      {/* Tier Title and Function */}
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
        {metadata.name}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {tiers[index].nfts} NFTs for {tiers[index].price}
      </p>

      {/* Image Container */}
      <div className="relative w-full h-72 sm:h-36 xs:h-56 minmd:h-60 minlg:h-72 rounded-2xl overflow-hidden">
        <Image
          src={metadata.image}
          fill
          alt={metadata.name}
          sizes="100%"
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Description and Button */}
      <div className="flex flex-col flex-grow mt-8">
        {/* Description */}
        <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-base mb-8 flex-grow">
          {metadata.description}
        </p>

        {/* Buy Button */}
        <div className="flex justify-center">
          <Button
            btnName={`Buy Grant NFT for ${tiers[index].price} Matic`}
            classStyles="rounded-full self-center"
            handleClick={handleClick}
          />
        </div>
      </div>
    </div>
  );
};

export default GrantNFTCard;
