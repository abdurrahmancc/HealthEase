import DoctorBusinessHourForm from "@/components/doctor/settings/businessHours/DoctorBusinessHourForm";
import { DoctorBusinessHour } from "@/types/types";
import { cookies } from "next/headers";




const DoctorBusinessHoursForm =async () => {
         const cookieStore = await cookies();
            const tokenCookie = cookieStore.get("accessToken");
            const accessToken = tokenCookie?.value;
            let businessHours: DoctorBusinessHour[] |null = null;
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/Doctor/GetBusinessHours`, { headers: { Authorization: `Bearer ${accessToken}` } });       
                if (response.ok) {
                    const data = await response.json();
                    businessHours = data.data;
                    // console.log("businessHours", businessHours)
                }
            } catch (error) {
                businessHours = null;
            }

    return (
        <>
            <DoctorBusinessHourForm businessHours={businessHours}  />
        </>
    );
};

export default DoctorBusinessHoursForm;
