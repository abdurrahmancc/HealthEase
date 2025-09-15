import DoctorServices from '@/components/doctor/Services/DoctorServices';
import { DoctorSpecialityService } from '@/types/types';
import { cookies } from 'next/headers';
import React from 'react';

const Services =async () => {
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get("accessToken");
        const accessToken = tokenCookie?.value;
    
        let services: DoctorSpecialityService[] |null = null;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/Doctor/GetServices`, { headers: { Authorization: `Bearer ${accessToken}` } });       
            if (response.ok) {
                const data = await response.json();
                services = data.data;
            }
        } catch (error) {
            services = null;
        }
    return (
        <div>
            <DoctorServices services={services} />
        </div>
    );
};

export default Services;