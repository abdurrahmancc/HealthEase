
"use client"
import { DoctorEducation, DoctorSpecialityService } from '@/types/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';


type ServiceProps = {
    services: DoctorSpecialityService[] | null;
};
type FormData = {
    Services: DoctorSpecialityService[];
};

const service = {
    speciality: "",
    service: "",
    price: 0,
    about: "",
}

const defaultSpecialityService: DoctorSpecialityService = {
    speciality: "",
    service: "",
    price: 0,
    about: "",
};

let specialityList = [
    { name: "Cardiology", value: "cardiology" },
    { name: "Neurology", value: "neurology" },
    { name: "Urology", value: "Urology" },
]

let serviceList = [
    { name: "Surgery", value: "Surgery" },
    { name: "General Checkup", value: "general Checkup" },
]

const DoctorServices = ({ services }: ServiceProps) => {
    const [isLogin, setIsLoading] = useState(false)
    const { register, handleSubmit, control, setValue, reset, watch, formState: { errors }, } = useForm<FormData>({ defaultValues: { Services: [service] } });
    const { fields, append, remove } = useFieldArray({ control, name: "Services" })


    const getSafeService = (e?: DoctorSpecialityService) => ({
        id: e?.id || "",
        speciality: e?.speciality || "",
        service: e?.service || "",
        price: e?.price || 0,
        about: e?.about || "",
    });

    useEffect(() => {
        const safeServices = services && services.length > 0 ? services.map(getSafeService) : [defaultSpecialityService];
        reset({ Services: safeServices });
    }, [services, reset]);

    const onSubmit = async (data: FormData) => {
        try {
            // console.log("data", data)
            setIsLoading(true)
            const sanitizedServices = data.Services.map((ser) => {
                const cleaned = { ...ser };
                if (!cleaned?.doctorId || cleaned?.doctorId.trim() === "") {
                    delete cleaned.doctorId;
                }
                return cleaned;
            });

            // console.log("sanitizedServices", sanitizedServices)
            await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/doctor/AddUpdateServices`, sanitizedServices, { withCredentials: true });
            toast.success("Services saved successfully!");

            const response = await fetch(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/Doctor/GetServices`, { credentials: "include" });
            if (response.ok) {
                const data = await response.json();
                const safeServices = data.data.map(getSafeService);
                reset({ Services: safeServices });
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false)
        }
    };


    return (
        <div className='h-[calc(100vh-85px)] overflow-y-auto p-4'>
            <div>
                <div className='flex justify-between items-center'>
                    <h5 className="text-[18px] font-semibold ">Speciality  & Services</h5>
                    <button className='btn btn-primary  rounded-[10px]' type="button" onClick={() => append(service)}>Add New Service</button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="p-4">
                    <div className='flex flex-col gap-10'>
                    {fields.map((field, index) => {
                        return (
                            <div key={index} className='border-[0.5px] border-gray-800 rounded-[10px] flex gap-10 items-center'>
                                <div className="join join-vertical w-full">
                                    <div className="collapse collapse-arrow join-item relative">
                                        <input id={`Services-${index}-toggle`} defaultChecked type="checkbox" />
                                        <div className="collapse-title font-semibold">
                                            Service
                                        </div>

                                        <div className="flex justify-end mb-2 z-10">
                                            <button disabled={fields.length == 1} type="button" className="btn btn-error rounded-[10px] btn-sm absolute top-3 right-12" onClick={() => remove(index)} >
                                                Delete
                                            </button>
                                        </div>
                                        <div className="collapse-content border-t-[0.5px] border-gray-700 !pb-0">
                                            <div className='flex gap-10 items-center pt-4'>
                                            </div>
                                            <div className='pt-5'>
                                                <div key={field.id} className="grid md:grid-cols-2 lg:grid-cols-2 w-full gap-[20px] mb-5" >
                                                    <div>
                                                        <label htmlFor={`Services-${index}-speciality`} className="label" >
                                                            <span className="label-text text-white">
                                                                Speciality *
                                                            </span>
                                                        </label>
                                                        <select
                                                            id={`Services-${index}-speciality`}
                                                            {...register(`Services.${index}.speciality`, { required: "Employment type is required" })}
                                                            className="select w-full bg-base-100 text-white border-gray-500"
                                                            defaultValue={field.speciality || ""}
                                                        >
                                                            <option value="Cardiology">Cardiology</option>
                                                            <option value="Neurology">Neurology</option>
                                                            <option value="Urology">Urology</option>
                                                        </select>

                                                        {errors.Services?.[index]?.speciality && (
                                                            <p className="text-red-500 text-sm">
                                                                {errors.Services[index]?.speciality?.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label htmlFor={`Services-${index}-service`} className="label" >
                                                            <span className="label-text text-white">
                                                                Service *
                                                            </span>
                                                        </label>
                                                        <select
                                                            id={`Services-${index}-service`}
                                                            {...register(`Services.${index}.service`, { required: "Employment type is required" })}
                                                            className="select w-full bg-base-100 text-white border-gray-500"
                                                            defaultValue={field.service || ""}
                                                        >
                                                            <option value="" disabled>Select Service</option>
                                                            <option value="Surgery">Surgery</option>
                                                            <option value="General Checkup">General Checkup</option>
                                                        </select>

                                                        {errors.Services?.[index]?.service && (
                                                            <p className="text-red-500 text-sm">
                                                                {errors.Services[index]?.service?.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div >
                                                        <label htmlFor={`Services-${index}-price`} className="label">
                                                            <span className="label-text text-white">
                                                                Price ($)
                                                            </span>
                                                        </label>
                                                        <input id={`Services-${index}-price`} {...register(`Services.${index}.price`, {
                                                            required: "Price is required",
                                                            pattern: { value: /^\d+(\.\d{1,2})?$/, message: "Enter a valid price (up to 2 decimal places)" }
                                                        })}
                                                            className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
                                                        {errors.Services?.[index]?.price && (
                                                            <p className="text-red-500 text-sm">
                                                                {errors.Services[index]?.price?.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div >
                                                        <label htmlFor={`Services-${index}-about`} className="label">
                                                            <span className="label-text text-white">
                                                                About Service
                                                            </span>
                                                        </label>
                                                        <input id={`Services-${index}-about`} {...register(`Services.${index}.about`)}
                                                            className="input input-bordered w-full bg-base-100 text-white border-gray-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
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
        </div >
    );
};

export default DoctorServices;