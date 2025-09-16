import SocialMediaForm from '@/components/doctor/SocialMedia/SocialMediaForm';
import { SocialMideaType } from '@/types/types';
import { cookies } from 'next/headers';
import React from 'react';



const SocialMedia =async () => {
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get("accessToken");
        const accessToken = tokenCookie?.value;
    
        let socials: SocialMideaType[] |null = null;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/Doctor/GetSocialMideaLinks`, { headers: { Authorization: `Bearer ${accessToken}` } });       
            if (response.ok) {
                const data = await response.json();
                socials = data.data;
            }
        } catch (error) {
            socials = null;
        }
    return (
        <>
            <SocialMediaForm socials={socials} />
        </>
    );
};

export default SocialMedia;