import React from 'react';
import DoctorClinicForm from '@/components/doctor/settings/Clinic/DoctorClinicForm';
import { DoctorClinic } from '@/types/types';
import { cookies } from 'next/headers';

const Clinic =async () => {
     const cookieStore = await cookies();
        const tokenCookie = cookieStore.get("accessToken");
        const accessToken = tokenCookie?.value;
    
        let clinics: DoctorClinic[] |null = null;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/Doctor/GetClinics`, { headers: { Authorization: `Bearer ${accessToken}` } });       
            if (response.ok) {
                const data = await response.json();
                clinics = data.data;
            }
        } catch (error) {
            clinics = null;
        }
    return (
        <>
            <DoctorClinicForm clinics={clinics} />
        </>
    );
};

export default Clinic;