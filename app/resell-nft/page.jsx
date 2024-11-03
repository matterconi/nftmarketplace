'use client'

import { useState, useEffect, useContext } from 'react'
import { NFTContext } from '../../context/NFTContext';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import images from '../../assets';
import { shortenAdress } from '@/utils/shortenAddress';

const ResellNFT = () => {
    const { createSale, isLoadingNFT } = useContext(NFTContext);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');

    const tokenId = searchParams.get('tokenId');
    const tokenURI = searchParams.get('tokenURI');

    const fetchNFT = async () => {
        const {data} = await axios.get(tokenURI);
        setPrice(data.price);
        setImage(data.image);
    };

    useEffect(() => {
        if(tokenURI) fetchNFT();
    }, [tokenURI]);

    const resell = async () => {
        await createSale(tokenURI, price, true, tokenId);
        router.push('/');
    }

    if (isLoadingNFT) {
        return (
            <div className='flexStart min-h-screen'>
                <Loading />
            </div>
        )
    }
    
    return (
        <div className='flex justify-center sm:px-4 p-12 mt-65'>
            <div className='w-3/5 md:w-full'>
                <h1 className='font-poppins dark:text-white text-nft-black font-semibold text-2xl'>Resell NFT</h1>
                <Input 
                    inputType='number'
                    title='Price'
                    placeholder='NFT Price'
                    handleClick={(e) => setPrice(e.target.value)}
                />

                {image && (
                    <Image src={image} className='rounded mt-4' objectFit="cover" width={350} height={350} alt="my-nft"/>
                )}

                <div className='mt-7 w-full flex justify-end'>
                    <Button 
                        btnName="List NFT"
                        handleClick={resell}
                        classStyles='rounded-xl'
                    />
                </div>
            </div>
        </div>
    )
}

export default ResellNFT