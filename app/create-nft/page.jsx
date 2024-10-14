'use client';

import { useState, useMemo, useCallback, useContext } from 'react'
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import Button from '../../components/Button';
import images from '../../assets';
import Input from '@/components/Input';

const CreateNft = () => {
  const { theme } = useTheme();
  const [fileUrl, setFileUrl] = useState('');
  const [ formInput, setFormInput ] = useState({
    name: '',
    description: '',
    price: ''
  });
  const router = useRouter();
  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ 
    onDrop,
    accept: 'image/*',
    maxFiles: 1,
    maxSize: 1048576,
  });
  const fileStyle = useMemo(() => {
    return `dark:bg-nft-black-1 bg-white border dark:border-white border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed 
    ${isDragActive &&'border-file-active'}
    ${isDragAccept &&'border-file-accept'}
    ${isDragReject &&'border-file-reject'}
    `
  }, [isDragActive, isDragAccept, isDragReject]);

  console.log('formInput', formInput);

  return (  
    <div className='flex justify-center sm:px-4 p-12'>
      <div className='w-s/5 md:w-full mt-65'>
        <h1 className='font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0'>
          Create new NFT
        </h1>
        <div className='mt-16'>
          <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-xl'>Upload files</p>
          <div className='mt-4'>
            <div {...getRootProps()} className={fileStyle}>
              <input {...getInputProps()} />
              <div className='flexCenter flex-col text-center'>
                <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-xl'>JPG, PNG, GIF, SVG, WEBM, Max 100mb</p>

                <div className='my-12 w-full flex justify-center '>
                  <Image src={images.upload} alt='upload' width={100} height={100} objectFit='contain' className={theme === 'light' && 'filter invert'} />
                </div>
                <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-sm'>Drag and Drop files</p>
                <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-sm mt-2'>or Browse media on your device</p>
              </div>
            </div>
            {fileUrl && (
              <aside>
                <div>
                  <Image src={fileUrl} alt='file' width={100} height={100} objectFit='contain' />
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
            handleClick={() => {}}
            classStyles='rounded-xl'
          />
        </div>
      </div>
    </div>
  )
}

export default CreateNft