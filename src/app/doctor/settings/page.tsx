import DoctorSettings from "@/components/doctor/settings/basicDetails/DoctorSettings";
import { DoctorBasicInfo, DoctorMembership, Language, UserDto } from "@/types/types";
import { cookies } from "next/headers";


const Settings = async () => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("accessToken");
  const accessToken = tokenCookie?.value;

  const response = await fetch(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/Users/GetLoginUser`, { headers: { Authorization: `Bearer ${accessToken}` } });
  let user: UserDto = {} as UserDto;
  if (response.ok) {
    try {
      const data = await response.json();
      user = data.data;
    } catch (error) {
      user = {} as UserDto;
    }
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/GetLanguages`, { headers: { Authorization: `Bearer ${accessToken}`, }, cache: "no-store", });
  let languages: Language[] = [];
  if (res.ok) {
    try {
      languages = await res.json();
    } catch {
      languages = [];
    }
  }


  const respon = await fetch(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/doctor/GetBasicInfo`, { headers: { Authorization: `Bearer ${accessToken}`, }, cache: "no-store", });
  let basicInfo: DoctorBasicInfo | null = null;
  if (respon.ok) {
    try {
      let info = await respon.json();
      basicInfo = info.data;
    } catch (error) {
      basicInfo = null;
    }
  }

    const resMemberships = await fetch(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/doctor/GetMemberships`, { headers: { Authorization: `Bearer ${accessToken}`, }, cache: "no-store", });
  let memberships: DoctorMembership[] | null = null;
  if (respon.ok) {
    try {
      let mems = await resMemberships.json();
      memberships = mems.data;
    } catch (error) {
      memberships = null;
    }
  }

  return (
    <>
      <DoctorSettings languages={languages} user={user} basicInfo={basicInfo} memberships={memberships} />
    </>
  );
};

export default Settings;