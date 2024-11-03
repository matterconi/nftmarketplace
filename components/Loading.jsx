// components/Loading.jsx
import Image from 'next/image';
import images from '../assets';

const Loading = () => {
  return (
    <div className="flexCenter w-full my-4">
      <Image src={images.loader} width={100} height={100} alt="loading" />
    </div>
  );
};

export default Loading;
