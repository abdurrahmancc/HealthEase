"use client";
import { patientRoutes } from '@/components/routes/patient';
import Link from 'next/link';
import React from 'react';
import { usePathname } from "next/navigation";

const PatientLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    return (
        <div className='container mx-auto py-10'>
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col">
                    <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden m-4">
                        Open drawer
                    </label>
                    <div className="px-10">{children}</div>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-72 min-h-full bg-base-200 border-2 border-base-300 rounded-[10px] text-base-content">
                        {patientRoutes.map((route) => {
                            const fullPath = `/patient${route.path ? "/" + route.path : ""}`;
                            const cleanPath = pathname.replace(/\/$/, "");
                            const isActive = cleanPath === fullPath;
                            return (
                                <li key={route.path}>
                                    <Link
                                        href={fullPath}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-[18px] transition-all ${isActive ? "bg-[#000615] text-white" : "hover:bg-base-300"
                                            }`}
                                    >
                                        {route.icon && (
                                            <route.icon className="w-5 h-5 text-inherit" />
                                        )}
                                        {route.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PatientLayout;