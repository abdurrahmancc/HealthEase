import { Image } from 'lucide-react';
import React from 'react';

type UploadImageProps = {
    title: string;
}

const UploadImage = ({ title }: UploadImageProps) => {
    return (
        <>
            <div className='w-[120px] h-[120px] border-[0.5px] border-gray-800 rounded-[10px] flex justify-center items-center'>
                <label htmlFor="UploadImage" className='w-full h-full cursor-pointer flex justify-center items-center'>
                    <input type="file" hidden id='UploadImage' />
                    <Image className='text-gray-600' />
                </label>
            </div>
            <div>
                <h5 className='text-[18px] font-semibold'>{title}</h5>
                <p className='mt-3'>Your Image should Below 500 kb, Accepted format jpg,png</p>
            </div>
        </>
    );
};

export default UploadImage;