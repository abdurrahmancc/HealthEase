'use client'
import { DoctorMembership } from '@/types/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type FormData = {
    memberships: DoctorMembership[];
};


interface MembershipsData {
    memberships: DoctorMembership[] | null;
}

const Memberships = ({ memberships }: MembershipsData) => {
    const [isLogin, setIsLogin] = useState(false);
    const defaultMemberships = memberships && memberships.length > 0 ? memberships : [{ membershipId: "", title: "", about: "", doctorId: "" }];
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({ defaultValues: { memberships: defaultMemberships } });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "memberships",
    });

    useEffect(() => {
        const safeMemberships = memberships?.map(m => ({
            membershipId: m.membershipId || "",
            title: m.title || "",
            about: m.about || "",
            doctorId: m.doctorId || ""
        })) || [{ membershipId: "", title: "", about: "", doctorId: "" }];

        reset({ memberships: safeMemberships });
    }, [memberships, reset]);


    const onSubmit = async (data: FormData) => {
        try {
            const existing = data.memberships.filter(m => m.membershipId);
            const news = data.memberships.filter(m => !m.membershipId);
            const payload = [...existing, ...news.map(m => ({ title: m.title, about: m.about }))];

            const { data: res } = await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/doctor/UpdateMemberships`, payload, { withCredentials: true })
            if (res.success) {
                toast.success(res.message)
            }
        } catch (error) {
            toast.error("something was wrong, please try ageing")
            console.error(error);
        }
    };
    return (
        <div>
            <div className='flex justify-between items-center mb-5'>
                <h5 className="text-[18px] font-semibold ">Memberships</h5>
                <button type="button" className="btn btn-primary rounded-[10px]" onClick={() => append({ membershipId: "", title: "", about: "", doctorId: "" })} >
                    Add New
                </button>
            </div>
            <div className="p-2 border-[0.5px] border-gray-700 rounded-[10px]">
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 ">
                    <div className="grid gap-5">
                        {fields.map((field, index) => (
                            <div key={field.id} className="grid md:grid-cols-2 lg:grid-cols-3 w-full gap-[20px] items-end">
                                <div>
                                    <label htmlFor={`memberships-${index}-title`} className="label">
                                        <span className="label-text text-white">Title *</span>
                                    </label>
                                    <input id={`memberships-${index}-title`} {...register(`memberships.${index}.title`, { required: "Title is required" })}
                                        className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
                                    {errors.memberships?.[index]?.title && (<p className="text-red-500 text-sm"> {errors.memberships[index]?.title?.message} </p>)}
                                </div>

                                <div className="col-span-2 flex items-end gap-5">
                                    <div className="w-full">
                                        <label htmlFor={`memberships-${index}-about`} className="label">
                                            <span className="label-text text-white">About *</span>
                                        </label>
                                        <input id={`memberships-${index}-about`} {...register(`memberships.${index}.about`, { required: "About is required", })}
                                            className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
                                        {errors.memberships?.[index]?.about && (<p className="text-red-500 text-sm">  {errors.memberships[index]?.about?.message} </p>)}
                                    </div>
                                    <button type="button" className="btn btn-error rounded-[10px]" disabled={fields.length == 1} onClick={() => remove(index)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add + Submit buttons */}
                    <div className="flex justify-end gap-5 ml-auto mt-5">
                        <button type="submit" className="btn btn-primary rounded-[8px]">
                            {isLogin ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <span>Save Changes</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default Memberships;