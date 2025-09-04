import DoctorExperienceForm from '@/components/doctor/settings/experience/DoctorExperienceForm';
import { DoctorExperience as DoctorExperienceTypes } from '@/types/types';
import { cookies } from 'next/headers';


const DoctorExperience = async () => {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("accessToken");
    const accessToken = tokenCookie?.value;

    let experiences: DoctorExperienceTypes[] |null = null;
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/Doctor/GetExperiences`, { headers: { Authorization: `Bearer ${accessToken}` } });       
        if (response.ok) {
            const data = await response.json();
            experiences = data.data;
        }
    } catch (error) {
        experiences = null;
    }


    return (
        <>
            <DoctorExperienceForm experiences={experiences} />
        </>
    );
};

export default DoctorExperience;