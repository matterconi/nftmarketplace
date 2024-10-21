'use client';

import { useState, useCallback, useContext, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

import { NFTContext } from '../../context/NFTContext';
import Button from '../../components/Button';
import Input from '@/components/Input';
import images from '../../assets';

const CreateNft = () => {
  const { theme } = useTheme();
  const [fileUrl, setFileUrl] = useState('');
  const [formInput, setFormInput] = useState({
    name: '',
    description: '',
    price: ''
  });

  const { createNFT } = useContext(NFTContext);
  const { uploadToIPFS } = useContext(NFTContext);
  const router = useRouter();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];

    // Define valid MIME types and file extensions
    const validFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'video/webm'];
    const validFileExtensions = ['.jpeg', '.jpg', '.png', '.gif', '.svg', '.webm'];

    // Extract file extension
    const fileExtension = file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();

    // Check if file type and extension are valid
    if (!validFileTypes.includes(file.type) || !validFileExtensions.includes(`.${fileExtension}`)) {
      console.error(`Unsupported file type or extension: ${file.type}, ${fileExtension}. Supported formats: JPG, PNG, GIF, SVG, WEBM.`);
      return;
    }

    console.log("Accepted file:", file);

    try {
      const url = await uploadToIPFS(file);
      if (url) {
        console.log("IPFS URL received:", url);
        setFileUrl(url);
      } else {
        console.error("Failed to upload the file to IPFS.");
      }
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
    }
  }, [uploadToIPFS]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/svg+xml': ['.svg'],
      'video/webm': ['.webm'],
    },
    maxFiles: 1,
    maxSize: 52428800, // 50MB
  });

  const fileStyle = useMemo(() => {
    return `dark:bg-nft-black-1 bg-white border dark:border-white border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed 
    ${isDragActive ? 'border-file-active' : ''}
    ${isDragAccept ? 'border-file-accept' : ''}
    ${isDragReject ? 'border-file-reject' : ''}
    `;
  }, [isDragActive, isDragAccept, isDragReject]);

  return (
    <div className='flex justify-center sm:px-4 p-12'>
      <div className='w-full md:w-full mt-65'>
        <h1 className='font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0'>
          Create new NFT
        </h1>
        <div className='mt-16'>
          <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-xl'>Upload files</p>
          <div className='mt-4'>
            <div {...getRootProps()} className={fileStyle}>
              <input {...getInputProps()} />
              <div className='flexCenter flex-col text-center'>
                <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-xl'>
                  JPG, PNG, GIF, SVG, WEBM, Max 50MB
                </p>
                <div className='my-12 w-full flex justify-center'>
                  <Image src={images.upload} alt='upload' width={100} height={100} className={theme === 'light' ? 'filter invert' : ''} />
                </div>
                <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-sm'>Drag and Drop files</p>
                <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-sm mt-2'>or Browse media on your device</p>
              </div>
            </div>
            {fileUrl && (
                <aside className="mt-4">
                  <div className="relative w-40 h-40">
                    <Image src={fileUrl} alt="Uploaded file" layout="fill" objectFit="contain" />
                  </div>
                </aside>
              )}
          </div>
        </div>

        <Input 
          inputType='input'
          title="Name"
          placeholder="Enter NFT name"
          handleClick={(e) => setFormInput({ ...formInput, name: e.target.value })}
        />
        <Input 
          inputType='textarea'
          title="Description"
          placeholder="Describe your NFT"
          handleClick={(e) => setFormInput({ ...formInput, description: e.target.value })}
        />
        <Input 
          inputType='number'
          title="Price"
          placeholder="Pick a price for your NFT"
          handleClick={(e) => setFormInput({ ...formInput, price: e.target.value })}
        />

        <div className='mt-7 w-full flex justify-end'>
          <Button 
            btnName="Create NFT"
            handleClick={() => createNFT(formInput, fileUrl, router)}
            classStyles='rounded-xl'
          />
        </div>
      </div>
    </div>
  );
};

export default CreateNft;
