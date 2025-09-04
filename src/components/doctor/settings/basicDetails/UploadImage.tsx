'use client';
import { Image as ImageIcon } from 'lucide-react';
import React, { useState } from 'react';
import Image from "next/image";
import { useLoginUser } from '@/hooks/useLoginUser';
import { useUploadPhotoUrl } from '@/hooks/useUploadPhotoUrl';

type UploadImageProps = {
    title: string;
    photoUrl?: string;
}


const UploadImage = ({ title, photoUrl }: UploadImageProps) => {
    const { uploadLoading, handleUploadPhotoUrl } = useUploadPhotoUrl();
    return (
        <>
            <div className='w-[120px] h-[120px] border-[0.5px] border-gray-800 rounded-[10px] flex justify-center items-center overflow-hidden relative'>
                {
                    uploadLoading ?  <span className="btn-loading !w-[16px] !h-[16px]"></span> : <label htmlFor="UploadImage" className='w-full relative h-full cursor-pointer flex justify-center items-center'>
                    <input onChange={handleUploadPhotoUrl} type="file" hidden id='UploadImage' />
                    {photoUrl ? (
                        <Image  src={photoUrl} alt="Profile Picture" priority   style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100px, 120px" fill />
                    ) : (
                        <ImageIcon className='text-gray-600' />
                    )}
                </label>
                }
            </div>

            <div>
                <h5 className='text-[18px] font-semibold'>{title}</h5>
                <p className='mt-3'>Your Image should Below 500 kb, Accepted format jpg,png</p>
            </div>
        </>
    );
};

export default UploadImage;