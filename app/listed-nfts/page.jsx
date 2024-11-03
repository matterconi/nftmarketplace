'use client'

import { useState, useEffect, useContext } from 'react'
import { NFTContext } from '../../context/NFTContext';
import NFTCard from '@/components/NFTCard';
import Loading from '@/components/Loading';

const ListedNFTs = () => {
    const { fetchMyNFTsOrListedNFTs } = useContext(NFTContext);
    const [nfts, setNfts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getNFTs = async () => {
          try {
            setIsLoading(true); // Start loading
            const data = await fetchMyNFTsOrListedNFTs('fetchItemsListed');
            setNfts(data); // Now setNfts is defined
          } catch (error) {
            console.error('Error fetching NFTs:', error);
          } finally {
            setIsLoading(false); // End loading
          }
        };
        getNFTs();
      }, [fetchMyNFTsOrListedNFTs]);
    
    if (isLoading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <Loading />
            </div>
        )
    }

    if(!isLoading && nfts.length === 0) {
        return (
            <div className='flexCenter sm:p-4 p-16 min-h-screen'>
                <h1 className='font-poppins dark:text-white text-nft-black-1 text-3xl font-extrabold'>No NFTs listed for Sale</h1>
            </div>
        )
    }
  return (
    <div className='flex justify-center sm:px-4 p-20 min-h-screen'>
        <div className='w-full minmd:w-4/5'>
            <div className='mt-4'>
                <h2 className='font-poppins dark:text-white text-nft-black-1 text-2xl font-semibold mt-2 ml-4 sm:ml-2'>NFTs that I've listed for sale</h2>
                <div className='mt-3 w-full flex flex-wrap justify-start md:justify-center'>
                    {nfts.map((nft) => (
                        <NFTCard key={nft.id} nft={nft} />
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default ListedNFTs