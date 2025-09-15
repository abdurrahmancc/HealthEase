import AvailableTimings from '@/components/doctor/AvailableTimings/AvailableTimings';
import { DoctorBusinessHour } from '@/types/types';
import { cookies } from 'next/headers';
import React from 'react';

const Available =async () => {
    const cookieStore = await cookies();
                const tokenCookie = cookieStore.get("accessToken");
                const accessToken = tokenCookie?.value;
            
                let businessHours: DoctorBusinessHour[] |null = null;
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/Doctor/GetBusinessHours`, { headers: { Authorization: `Bearer ${accessToken}` } });       
                    if (response.ok) {
                        const data = await response.json();
                        businessHours = data.data;
                    }
                } catch (error) {
                    businessHours = null;
                }
    
    return (
        <div className="p-4  h-[calc(100vh-220px)] overflow-y-auto">
            <AvailableTimings businessHours={businessHours} />
        </div>
    );
};

export default Available;