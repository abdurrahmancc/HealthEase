"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import { usePathname, useRouter } from "next/navigation";
import { doctorRoutes } from '@/components/routes/doctor';
import { Camera, LogOut } from 'lucide-react';
import { removeCookie } from '@/hooks/useCookies';
import { useLoginUser } from '@/hooks/useLoginUser';
import { useUploadPhotoUrl } from '@/hooks/useUploadPhotoUrl';
import Loading from '@/shared/Loading';
import { FaUserCircle } from 'react-icons/fa';
import userIcon from "../../../public/icons/userIcon.svg"

const DoctorLayout = ({ children }: { children: React.ReactNode }) => {
    let { user, loading, error, setRefreshGetLoginUser } = useLoginUser();
    const { uploadLoading, handleUploadPhotoUrl } = useUploadPhotoUrl(setRefreshGetLoginUser)
    const router = useRouter()
    const pathname = usePathname();

    const handleLogOut = async () => {
        await removeCookie()
        router.push("/login")
    }
    


    return (
        <div className='container mx-auto py-10'>
            <div className="drawer lg:drawer-open lg:gap-10">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col">
                    <div className='bg-base-200 rounded-[10px] h-[calc(100vh-80px)]'>
                        {children}
                        {
                            loading && <Loading />
                        }
                    </div>
                </div>
                <div className="drawer-side h-[calc(100vh-80px)]">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-72 min-h-[calc(100vh-80px)] bg-base-200 lg:rounded-[10px] text-base-content">
                        <li>
                            <div className='flex flex-col justify-center items-center cursor-default text-center bg-neutral mb-5 py-5'>
                                <div className="avatar mx-auto">
                                    <div className="ring-neutral ring-offset-base-100 w-24 rounded-full ring-2 ring-offset-2">
                                        {
                                            user?.photoUrl ? <img src={user?.photoUrl || userIcon.src} onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.onerror = null;
                                                target.src = userIcon.src;
                                            }}
                                            alt={user?.firstName} /> : <FaUserCircle className='w-24 text-[96px]' />
                                        }
                                        <FaUserCircle className='w-24 text-[96px]' />
                                    </div>
                                    <div className='border !flex items-center justify-center border-gray-100 w-[25px] h-[25px] bg-base-100 rounded-full absolute bottom-3 -right-2 '>
                                        {uploadLoading ? <span className="btn-loading !w-[16px] !h-[16px]"></span> :
                                            <label htmlFor='uploadPhoto' className='rounded-full cursor-pointer inline-block w-full h-full p-1'>
                                                <Camera className='w-[15px] h-[15px]' />
                                                <input onChange={handleUploadPhotoUrl} type="file" name="" hidden id="uploadPhoto" />
                                            </label>
                                        }
                                    </div>
                                </div>
                                <div>
                                    <h4 className='text-[20px] font-semibold'>{user?.firstName} {user?.lastName}</h4>
                                    <p className='text-[14px]'>BDS, MDS - Oral & Maxillofacial Surgery</p>
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