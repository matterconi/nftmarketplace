'use client';
// Import useRouter and searchParams from next/navigation
import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation'; // Correct import for Next.js app directory
import { NFTContext } from '../../context/NFTContext';
import NFTCard from '@/components/NFTCard';
import Loading from '@/components/Loading';
import Button from '@/components/Button';

import images from '../../assets';
import { shortenAddress } from '@/utils/shortenAddress';
import Modal from '@/components/Modal';

const PaymentBodyCmp = ({ nft, nftCurrency }) => {
  return (
    <div className='flex flex-col'>
      <div className='flexBetween'>
        <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl'>Item</p>
        <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl'>Subtotal</p>
      </div>
      <div className='flexBetweenStart my-5'>
        <div className='flex-1 flexStartCenter'>
          <div className='relative w-28 h-28'>
            <Image src={nft.image} layout="fill" objectFit="cover"/>
          </div>
          <div className='flexCenterStart flex-col ml-5'>
            <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl'>{shortenAddress(nft.seller)}</p>
            <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl'>{nft.name}</p>
          </div>
        </div>
          <div>
            <p className='font-poppins dark:text-white text-nft-black-1 font-normal text-sm minlg:text-xl'>{nft.price} <span className='font-semibold'>{nftCurrency}</span></p>
          </div>
      </div>
      <div className='flexBetween mt-10'>
        <p className='font-poppins dark:text-white text-nft-black-1 font-normal text-base minlg:text-xl'>Total</p>
        <p className='font-poppins dark:text-white text-nft-black-1 font-normal text-sm minlg:text-xl'>{nft.price} <span className='font-semibold'>{nftCurrency}</span></p>
      </div>
    </div>
  )
};

const NFTDetails = () => {
    const { currentAccount, nftCurrency, buyNFT, isLoadingNFT } = useContext(NFTContext);
    const [isLoading, setIsLoading] = useState(true);
    const [nft, setNFT] = useState({ image: '', tokenId: '', name: '', owner: '', price: '', seller: '', description: '', tokenURI: '' });
    const [paymentModal, setPaymentModal] = useState(false);
    const [success, setSuccess] = useState(false);
    // Use useSearchParams to get query parameters in the new app directory structure
    const searchParams = useSearchParams();
    const router = useRouter();

    const checkout = async () => {
      await buyNFT(nft);

      setPaymentModal(false);
      setSuccess(true)
    }

    useEffect(() => {
      const tokenId = searchParams.get('tokenId');
      const name = searchParams.get('name');
      const price = searchParams.get('price');
      const seller = searchParams.get('seller');
      const owner = searchParams.get('owner');
      const description = searchParams.get('description');
      const image = searchParams.get('image');
      const tokenURI = searchParams.get('tokenURI');

      // Set NFT details based on query parameters
      if (tokenId && name && price && seller && owner && description && image && tokenURI) {
        setNFT({ tokenId, name, price, seller, owner, description, image, tokenURI });
        setIsLoading(false);
      }
    }, [searchParams]);

    if (isLoading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <Loading />
            </div>
        );
    }

    return (
      <div className="relative flex justify-center md:flex-col min-h-screen pt-65">
        {/* Image Section */}
        <div className="relative flex-1 flexCenter sm:px-4 p-12 border-r md:border-r-0 md:border-b dark:border-nft-black-1 border-nft-gray-1">
          <div className="relative w-557 minmd:w-2/3 minmd:h-2/3 sm:w-full sm:h-300 h-557">
            <Image 
              src={nft.image || images[`nft${nft.i}`]} 
              objectFit="cover" 
              className="rounded-xl shadow-lg" 
              layout="fill" 
              alt={nft.name}
            />
          </div>
        </div>
    
        {/* Details Section */}
        <div className="flex-1 justify-start sm:px-4 p-12 sm:pb-4">
          {/* NFT Name */}
          <div className="flex flex-row sm:flex-col">
            <h2 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl minlg:text-3xl">
              {nft.name}
            </h2>
          </div>
    
          {/* Creator Info */}
          <div className="mt-10">
            <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-normal">
              Creator
            </p>
            <div className="flex flex-row items-center mt-3">
              <div className="relative w-12 h-12 minlg:w-20 minlg:h-20 mr-2">
                <Image 
                  src={images.creator1} 
                  className="rounded-full" 
                  alt="Creator Image" 
                />
              </div>
              <p className="font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-lg font-semibold">
                {shortenAddress(nft.seller)}
              </p>
            </div>
          </div>
    
          {/* NFT Details */}
          <div className="mt-10 flex flex-col">
            <div className="w-full border-b dark:border-nft-black-1 border-nft-gray-1 flex flex-row">
              <p className="font-poppins dark:text-white text-nft-black-1 font-medium text-base mb-2">
                Details
              </p>
            </div>
            <div className="mt-3">
              <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-base">
                {nft.description}
              </p>
            </div>
          </div>
          <div className='flex flex-row sm:flex-col mt-10'>
            {currentAccount === nft.seller.toLowerCase() 
            ? (<p className='font-poppins dark:text-white text-nft-black-1 text-base font-normal border border-gray p-2'>
              You are not allowed to buy your own NFT.
            </p>
            ) : currentAccount === nft.owner.toLowerCase()
            ? (
              <Button 
                btnName = "List on Marketplace"
                classStyles = "mr-5 sm:mr-0 sm:mb-5 rounded-xl"
                handleClick={() => router.push(`/resell-nft?tokenId=${nft.tokenId}&tokenURI=${nft.tokenURI}`)}
              />
            )
            : (
              <Button 
                btnName={`Buy for ${nft.price} ${nftCurrency}`} 
                classStyles="mr-5 sm:mr-0 rounded-xl"  
                handleClick={() => setPaymentModal(true)}
              />
            )}
          </div>
        </div>

        {isLoadingNFT && <Modal 
          header="Buying NFT"
          body={(
            <div className='flexCenter flex-col text-center'>
              <div className='relative w-52 h-52'>
                <Loading />
              </div>
            </div>
          )}
          handleClose={() => setPaymentModal(false)}
        />}

        {paymentModal && <Modal 
          header="Check out"
          body={<PaymentBodyCmp nft={nft} nftCurrency={nftCurrency}/>}
          footer={(<div className='flex flex-row sm:flex-col'>
            <Button 
              btnName="Checkout"
              classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
              handleClick={checkout}
            />
            <Button 
              btnName="Cancel"
              classStyles="rounded-xl"
              handleClick={() => setPaymentModal(false)}
            />
          </div>)}
          handleClose={() => setPaymentModal(false)}
        />}

        {success && 
          <Modal 
            header="Payment Successful"
            body={(<div className="flexCenter flex-col text-center" onClick={() => setSuccess(false)}>
              <div className='relative w-52 h-52'>
                <Image src={nft.image} objectFit='cover' layout="fill"/>
              </div>
              <p className='font-poppins dark:text-white text-nft-black-1 font-normal text-sm minlg:text-xl mt-10'>
                You Successfully purchased <span className="font-semibold">{nft.name}</span> from  <span className="font-semibold">{shortenAddress(nft.seller)}</span>
              </p>
            </div>)}
            footer={(<div className='flexCenter flex-col'>
              <Button 
                btnName="Check it out"
                classStyles="mr-5 rounded-xl"
                handleClick={() => router.push('/my-nfts')}
              />
            </div>)}
            handleClose={() => setPaymentModal(false)}
          />}
      </div>
    );    
};

export default NFTDetails;
