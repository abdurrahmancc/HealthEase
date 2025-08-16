"use client";
import DoctorSettingsLayout from '@/components/doctor/settings/DoctorSettingsLayout';
import Memberships from '@/components/doctor/settings/basicDetails/Memberships';
import UploadImage from '@/components/doctor/settings/basicDetails/UploadImage';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

type FormData = {
    firstName: string;
    lastName: string;
    displayName: string;
    designation: string;
    phoneNumbers: string;
    email: string;
    knownLanguages: string[];
};

const languagesList = [
    { id: 1, name: "English" },
    { id: 2, name: "Spanish" },
    { id: 3, name: "German" },
    { id: 4, name: "French" },
    { id: 5, name: "Arabic" },
    { id: 6, name: "Finnish" },
    { id: 7, name: "Basque" },
    { id: 8, name: "Esperanto" },
    { id: 9, name: "Estonian" },
    { id: 10, name: "Ewe" },
];

const Settings = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredOptions = languagesList.filter(
        (lang) =>
            lang.name.toLowerCase().includes(search.toLowerCase()) &&
            !selected.includes(lang.name)
    );

    const addLanguage = (lang: string) => {
        setSelected([...selected, lang]);
        setSearch("");
        setIsOpen(false);
    };

    const removeLanguage = (lang: string) => {
        setSelected(selected.filter((s) => s !== lang));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            firstName: "",
            lastName: "",
            displayName: "",
            designation: "",
            phoneNumbers: "",
            email: "",
            knownLanguages: [],
        },
    });

    const onSubmit = (data: FormData) => {
        console.log(data);
    };
    return (
        <div className=' h-[calc(100vh-220px)] overflow-y-auto p-4'>
            <div>
                <h5 className="text-[18px] font-semibold mb-5">Profile</h5>
                <div className='p-5 border-[0.5px] border-gray-800 rounded-[10px] flex gap-10 items-center'>
                    <UploadImage title={'Profile Image'} />
                </div>
            </div>
            <div className='mt-10'>
                <h5 className='text-[18px] font-semibold mb-5'>Information</h5>
                <div className='p-2 border-[0.5px] border-gray-700 rounded-[10px]'>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-4 ">
                        <div className='grid md:grid-cols-2 lg:grid-cols-3 w-full gap-[20px]'>
                            <div>
                                <label htmlFor='firstName' className="label">
                                    <span className="label-text text-white">First Name *</span>
                                </label>
                                <input id='firstName' {...register("firstName", { required: "First Name is required" })}
                                    className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
                                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                            </div>

                            <div>
                                <label htmlFor='lastName' className="label">
                                    <span className="label-text text-white">Last Name *</span>
                                </label>
                                <input {...register("lastName", { required: "Last Name is required" })}
                                    className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
                                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                            </div>

                            <div>
                                <label htmlFor='designation' className="label">
                                    <span className="label-text text-white">Designation *</span>
                                </label>

                                <input   {...register("designation", { required: "Designation is required" })}
                                    className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
                                {errors.designation && <p className="text-red-500 text-sm">{errors.designation.message}</p>}
                            </div>

                            <div>
                                <label htmlFor='phoneNumbers' className="label">
                                    <span className="label-text text-white">Phone Numbers *</span>
                                </label>

                                <input   {...register("phoneNumbers", { required: "Phone number is required" })}
                                    className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
                                {errors.phoneNumbers && <p className="text-red-500 text-sm">{errors.phoneNumbers.message}</p>}
                            </div>

                            <div>
                                <label htmlFor='email' className="label">
                                    <span className="label-text text-white">Email Address *</span>
                                </label>

                                <input   {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }, })}
                                    className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                            </div>

                            <Controller
                                name="knownLanguages"
                                control={control}
                                render={({ field }) => {
                                    const addLanguage = (lang: string) => {
                                        field.onChange([...field.value, lang]);
                                        setSearch("");
                                        setIsOpen(false);
                                    };

                                    const removeLanguage = (lang: string) => {
                                        field.onChange(field.value.filter((s: string) => s !== lang));
                                    };

                                    const filteredOptions = languagesList.filter((lang) => lang.name.toLowerCase().includes(search.toLowerCase()) && !field.value.includes(lang.name));

                                    return (
                                        <div className="lg:col-span-3 md:col-span-2 col-span-1 relative" ref={containerRef}>
                                            <label htmlFor='languages' className="label">
                                                <span className="label-text text-white">languages *</span>
                                            </label>
                                            <div className="flex flex-wrap gap-1 border border-gray-500 p-2 rounded-md cursor-text"
                                                onClick={() => setIsOpen(true)}   >
                                                {field.value.map((lang: string) => (
                                                    <div key={lang} className="bg-white text-neutral  px-2 py-1 rounded-full flex items-center gap-1"  >
                                                        {lang}
                                                        <span className="cursor-pointer" onClick={() => removeLanguage(lang)}>×</span>
                                                    </div>
                                                ))}
                                                <input id='languages' className="flex-1 p-1 outline-none" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Select languages" />
                                            </div>

                                            {isOpen && filteredOptions.length > 0 && (
                                                <ul className="absolute z-10 bg-base-300 border border-gray-500 w-full mt-1 max-h-40 overflow-auto rounded-md shadow">
                                                    {filteredOptions.map((lang) => (
                                                        <li key={lang.id} className="px-3 py-2 hover:bg-base-100 cursor-pointer" onClick={() => addLanguage(lang.name)} >
                                                            {lang.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    );
                                }} />

                        </div>
                        <div className='flex justify-end'>
                            <button type="submit" className="btn btn-primary ml-auto  rounded-[8px] mt-5">
                                {isLogin ? (
                                    <span className="loading loading-spinner  loading-sm"></span>
                                ) : (
                                    <span>Save Changes</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className='mt-10'>
                <Memberships />
            </div>
        </div>
    );
};

export default Settings;