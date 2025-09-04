// import React from 'react';
import DoctorEducationForm from '@/components/doctor/settings/education/DoctorEducationForm';
import { DoctorEducation } from '@/types/types';
import { cookies } from 'next/headers';


const Education = async () => {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("accessToken");
    const accessToken = tokenCookie?.value;

    let educations: DoctorEducation[] |null = null;
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/Doctor/GetEducations`, { headers: { Authorization: `Bearer ${accessToken}` } });       
        if (response.ok) {
            const data = await response.json();
            educations = data.data;
        }
    } catch (error) {
        educations = null;
    }
    return (
        <DoctorEducationForm  educations={educations} />
    );
};

export default Education;