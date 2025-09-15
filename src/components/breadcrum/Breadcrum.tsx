import { usePathname } from 'next/navigation';
import React from 'react';

const Breadcrum = () => {
    const pathname = usePathname(); 
    // console.log("pathname", pathname)
    return (
        <div className='bg-[#000615]'>
            <div className='container mx-auto py-10'>
                <div className='text-center'>
                    dashboard
                </div>
            </div>
        </div>
    );
};

export default Breadcrum;