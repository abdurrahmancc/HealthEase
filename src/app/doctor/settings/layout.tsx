import DoctorSettingsLayout from '@/components/doctor/settings/DoctorSettingsLayout';
import React from 'react';

const DoctorProdileSettingsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className='p-4'>
                <DoctorSettingsLayout />
            </div>
            {children}
        </>
    );
};

export default DoctorProdileSettingsLayout;