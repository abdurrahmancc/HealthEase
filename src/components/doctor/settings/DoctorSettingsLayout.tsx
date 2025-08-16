'use client'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import React from 'react';

const DoctorSettingsLayout = () => {
    const pathname = usePathname().replace(/\/$/, "");

    const routes = [
        { path: "", name: "basic Details" },
        { path: "experience", name: "Experience" },
        { path: "education", name: "Education" },
        { path: "clinics", name: "Clinics" },
        { path: "business-hours", name: "Business Hours" },
    ];
    return (
        <div className="flex gap-4 p-5 bg-[#0006156c] rounded-[10px]">
            {routes.map((route) => {
                const fullPath = `/doctor/settings/${route.path}`;
                const isActive =  route.path === "" ? pathname === "/doctor/settings" : pathname.startsWith(fullPath);
                return (
                    <Link key={route.path}
                        href={fullPath}
                        className={`flex border-[0.5px] border-gray-800 items-center gap-2 px-3 py-2 rounded-md text-[18px] transition-all ${isActive ? "bg-[#000615] text-white" : "hover:bg-base-300"}`} >
                        {route.name}
                    </Link>
                );
            })}
        </div>
    );
};

export default DoctorSettingsLayout;