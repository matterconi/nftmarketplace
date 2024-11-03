'use client';
// pages/purchase-grant.js

import { useState, useEffect } from 'react';
import Image from 'next/image';



import { useGrant } from '../../context/GrantContext';
import GrantNFTCard from '@/components/GrantNFTCard';
import GrantCard from '@/components/GrantCard';
import tiers from '@/data/tiers';
import Modal from '@/components/Modal';
import Button from '@/components/Button';

const PaymentBodyCmp = ({ nft, nftCurrency, tier }) => {
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
            <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl'>NFT Marketplace</p>
            <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl'>{nft.name}</p>
          </div>
        </div>
          <div>
            <p className='font-poppins dark:text-white text-nft-black-1 font-normal text-sm minlg:text-xl'>{tier.price} <span className='font-semibold'>{nftCurrency}</span></p>
          </div>
      </div>
      <div className='flexBetween mt-10'>
        <p className='font-poppins dark:text-white text-nft-black-1 font-normal text-base minlg:text-xl'>Total</p>
        <p className='font-poppins dark:text-white text-nft-black-1 font-normal text-sm minlg:text-xl'>{tier.price} <span className='font-semibold'>{nftCurrency}</span></p>
      </div>
    </div>
  )
};

const PurchaseGrantNFT = () => {
  const [tier, setTier] = useState(null);
  const [index, setIndex] = useState(0);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [nft, setNft] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);
  const [success, setSuccess] = useState(false);



  // Access purchaseGrantNFT and getUri from GrantContext
  const { purchaseGrantNFT: purchaseGrantNFTFunction, getUri, getMyNFTs } = useGrant();

  useEffect(() => {
    const fetchMyNFTs = async () => {
      try {
        const items = await getMyNFTs();
        console.log("Fetched my NFTs:", items);        
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
    };

    fetchMyNFTs();
    }, [purchaseGrantNFTFunction, getMyNFTs]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const uris = await getUri();
        // Fetch metadata for each URI and wait for all to complete
        const responses = await Promise.all(uris.map(uri => fetch(uri)));
        const data = await Promise.all(responses.map(response => response.json()));
    
        setMetadata(data); // `data` will be an array of parsed metadata
        console.log("Fetched metadata:", data);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };
    
    fetchMetadata();
  }, [getUri]);

  const handlePurchase = async (index) => {
    setIsPurchasing(true);
    try {
      console.log("Starting purchase with tier:", index);

      // Call the purchase function from context
      const tx = await purchaseGrantNFTFunction(index);
      const receipt = await tx.wait();
      const transactionHash = receipt.hash;
      setTransactionHash(transactionHash);
    } catch (error) {
      console.error("Purchase failed in handlePurchase:", error);
      alert("Failed to purchase Grant NFT.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const checkout = async () => {
    await purchaseGrantNFTFunction(index);

    setPaymentModal(false);
    setSuccess(true)
  }

  return (
    <div className="container mx-auto p-4 my-12">
      <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0'">Choose your Grant</h1>
      {/* Metadata Display */}
      {metadata?.length > 0 ? (
          <div className='mt-12 md:hidden w-full flex justify-center gap-8'>
            {metadata.map((metadata, index) => (
              <>
                <GrantNFTCard key={index} metadata={metadata} tiers={tiers} index={index} setPaymentModal={setPaymentModal} setTier={setTier} setNft={setNft} setIndex={setIndex}/>
              </>
            ))}
          </div>
      ) : (
        <p>Something went wrong... Probably the developer was fucking hard while the ai hallucinated </p>
      )}
          {metadata?.length > 0 && <div className="md:flex lg:hidden minmd:hidden justify-center mt-12">
            <GrantCard metadata={metadata} tiers={tiers} setPaymentModal={setPaymentModal} setTier={setTier} setNft={setNft} setIndex={setIndex} />
          </div>}

          {/* {isLoadingNFT && <Modal 
          header="Buying NFT"
          body={(
            <div className='flexCenter flex-col text-center'>
              <div className='relative w-52 h-52'>
                <Loading />
              </div>
            </div>
          )}
          handleClose={() => setPaymentModal(false)}
        />} */}

        {paymentModal && <Modal 
          header="Check out"
          body={<PaymentBodyCmp nft={nft} nftCurrency={'Matic'} tier={tier}/>}
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
                You Successfully purchased <span className="font-semibold">{nft.name}</span> that gives you  <span className="font-semibold">{tier.nfts} mint</span>
              </p>
            </div>)}
            footer={(<div className='flexCenter flex-col'>
              <Button 
                btnName="Check it out"
                classStyles="mr-5 rounded-xl"
                handleClick={() => router.push('/my-nfts')}
              />
            </div>)}
            handleClose={() => setSuccess(false)}
          />}
    </div>
  );
};

export default PurchaseGrantNFT;
