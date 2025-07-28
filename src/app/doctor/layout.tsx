"use client";
import Link from 'next/link';
import React from 'react';
import { usePathname, useRouter } from "next/navigation";
import { doctorRoutes } from '@/components/routes/doctor';
import { Camera, LogOut } from 'lucide-react';
import { removeCookie } from '@/hooks/useCookies';

const DoctorLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter()

    const handleLogOut = () => {
        removeCookie()
        router.push("/login")
    }

    return (
        <div className='container mx-auto py-10'>
            <div className="drawer lg:drawer-open lg:gap-10">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col">
                    <div className='bg-base-200 p-4 rounded-[10px] h-[calc(100vh-80px)] p'>
                        {children}
                    </div>
                </div>
                <div className="drawer-side h-[calc(100vh-80px)]">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-72 min-h-[calc(100vh-80px)] bg-base-200 lg:rounded-[10px] text-base-content">
                       <li>
                            <div className='flex flex-col justify-center items-center text-center bg-neutral mb-5 py-5'>
                                <div className="avatar mx-auto">
                                    <div className="ring-neutral ring-offset-base-100 w-24 rounded-full ring-2 ring-offset-2">
                                        <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
                                    </div>
                                    <div className='border border-gray-100 p-1 rounded-full absolute bg-base-100 hover:bg-primary hover:text-white bottom-3 -right-2 '>
                                        <Camera className='w-[15px] h-[15px]' />
                                    </div>
                                </div>
                                <div>
                                    <h4 className='text-[20px] font-semibold'>Abdur Rahman</h4>
                                    <p className='text-[14px]'>BDS, MDS - Oral & Maxillofacial Surgery</p>
                                    <span></span>
                                </div>
                            </div>
                        </li>
                        {doctorRoutes.map((route) => {
                            const fullPath = `/doctor${route.path ? "/" + route.path : ""}`;
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
                        <li onClick={() => handleLogOut()}>
                            <div className='flex items-center gap-2 px-3 py-2 rounded-md text-[18px] transition-all hover:bg-base-300'>
                                <LogOut className="w-5 h-5 text-inherit" /> Logout
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DoctorLayout;