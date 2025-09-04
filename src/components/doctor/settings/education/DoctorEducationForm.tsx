'use client'
import { DoctorEducation } from '@/types/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';


type EducationProps = {
    educations: DoctorEducation[] | null;
};
type FormData = {
    Educations: DoctorEducation[];
};

const education = {
    instituteName: "",
    course: "",
    description: "",
    startDate: "",
    endDate: "",
    isCurrentlyOngoing: false,
}

const defaultExperience: DoctorEducation = {
    instituteName: "",
    course: "",
    description: "",
    startDate: "",
    endDate: "",
    isCurrentlyOngoing: false,
    // doctorId: "",
};

const DoctorEducationForm = ({ educations }: EducationProps) => {
    const [isLogin, setIsLoading] = useState(false)
    const { register, handleSubmit, control, setValue, reset, watch, formState: { errors }, } = useForm<FormData>({ defaultValues: { Educations: [education] } });
    const { fields, append, remove } = useFieldArray({ control, name: "Educations" })


    const getSafeEducation = (e?: DoctorEducation) => ({
        instituteName: e?.instituteName || "",
        course: e?.course || "",
        description: e?.description || "",
        startDate: e?.startDate ? new Date(e.startDate).toISOString().split("T")[0] : "",
        endDate: e?.endDate ? new Date(e.endDate).toISOString().split("T")[0] : "",
        isCurrentlyOngoing: e?.isCurrentlyOngoing ?? false,
        // doctorId: e?.doctorId || "",

    });

    useEffect(() => {
        const safeDoctors = educations && educations.length > 0 ? educations.map(getSafeEducation) : [defaultExperience];
        reset({ Educations: safeDoctors });
    }, [educations, reset]);

    const onSubmit = async (data: FormData) => {
        try {
            console.log("data", data)
            setIsLoading(true)
            const sanitizedEducations = data.Educations.map((edu) => {
                const cleaned = { ...edu };
                if (!cleaned?.doctorId || cleaned?.doctorId.trim() === "") {
                    delete cleaned.doctorId;
                }
                if (!cleaned.endDate || cleaned.endDate.trim() === "" || cleaned.isCurrentlyOngoing == true) {
                    delete cleaned.endDate;
                }
                return cleaned;
            });

            await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/doctor/AddUpdateEducations`, sanitizedEducations, { withCredentials: true });
            toast.success("Experiences saved successfully!");

            const response = await fetch(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/Doctor/GetEducations`, { credentials: "include" });
            if (response.ok) {
                const data = await response.json();
                const safeExperiences = data.data.map(getSafeEducation);
                reset({ Educations: safeExperiences });
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false)
        }
    };


    return (
        <div className='h-[calc(100vh-220px)] overflow-y-auto p-4'>
            <div>
                <div className='flex justify-between items-center'>
                    <h5 className="text-[18px] font-semibold ">Education</h5>
                    <button className='btn btn-primary  rounded-[10px]' type="button" onClick={() => append(education)}>Add New Education</button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 ">
                    {fields.map((field, index) => {
                        const isWorking = watch(`Educations.${index}.isCurrentlyOngoing`);
                        return (
                            <div key={index} className='border-[0.5px] border-gray-800 rounded-[10px] flex gap-10 items-center'>
                                <div className="join join-vertical w-full">
                                    <div className="collapse collapse-arrow join-item relative">
                                        <input id={`Educations-${index}-toggle`} defaultChecked type="checkbox" />
                                        <div className="collapse-title font-semibold">
                                            Education
                                        </div>

                                        <div className="flex justify-end mb-2 z-10">
                                            <button disabled={fields.length == 1} type="button" className="btn btn-error rounded-[10px] btn-sm absolute top-3 right-12" onClick={() => remove(index)} >
                                                Delete
                                            </button>
                                        </div>
                                        <div className="collapse-content border-t-[0.5px] border-gray-700 !pb-0">
                                            <div className='flex gap-10 items-center pt-4'>
                                                {/* <UploadImage title='Hospital Logo' /> */}
                                            </div>
                                            <div className='pt-5'>
                                                <div key={field.id} className="grid md:grid-cols-2 lg:grid-cols-3 w-full gap-[20px] mb-5" >
                                                    <div className='lg:col-span-3 md:col-span-2 grid md:grid-cols-2 md: gap-[20px]'>
                                                        <div>
                                                            <label htmlFor={`Educations-${index}-title`} className="label"  >
                                                                <span className="label-text text-white">
                                                                    Name of the institution *
                                                                </span>
                                                            </label>
                                                            <input id={`Educations-${index}-title`}  {...register(`Educations.${index}.instituteName`, { required: "Title is required", })}
                                                                className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
                                                            {errors.Educations?.[index]?.instituteName && (
                                                                <p className="text-red-500 text-sm">
                                                                    {errors.Educations[index]?.instituteName?.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label htmlFor={`Experiences-${index}-hospital`} className="label" >
                                                                <span className="label-text text-white">
                                                                    Course *
                                                                </span>
                                                            </label>
                                                            <input id={`Educations-${index}-course`}  {...register(`Educations.${index}.course`, {
                                                                required: "Hospital is required",
                                                            })} className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
                                                            {errors.Educations?.[index]?.course && (
                                                                <p className="text-red-500 text-sm">
                                                                    {errors.Educations[index]?.course?.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label htmlFor={`Experiences-${index}-startDate`} className="label">
                                                            <span className="label-text text-white">Start Date</span>
                                                        </label>
                                                        <input
                                                            id={`Experiences-${index}-startDate`}
                                                            type="date"
                                                            className="input input-bordered w-full bg-base-100 text-white border-gray-500"
                                                            {...register(`Educations.${index}.startDate`, { required: "Start date is required" })}
                                                            defaultValue={field.startDate
                                                                ? new Date(field.startDate).toISOString().split("T")[0]
                                                                : ""}
                                                        />
                                                        {errors.Educations?.[index]?.startDate && (
                                                            <p className="text-red-500 text-sm">{errors.Educations[index]?.startDate?.message}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label htmlFor={`Experiences-${index}-endDate`} className="label">
                                                            <span className="label-text text-white">End Date</span>
                                                        </label>
                                                        <input
                                                            id={`Experiences-${index}-endDate`}
                                                            type="date"
                                                            className="input input-bordered w-full bg-base-100 text-white border-gray-500"
                                                            {...register(`Educations.${index}.endDate`, { required: !isWorking ? "End date is required" : false })}
                                                            disabled={isWorking}
                                                            defaultValue={field.endDate ? new Date(field.endDate).toISOString().split("T")[0] : ""}
                                                        />
                                                        {errors.Educations?.[index]?.endDate && (
                                                            <p className="text-red-500 text-sm">{errors.Educations[index]?.endDate?.message}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center mt-5">
                                                        <label htmlFor={`Educations-${index}-IsCurrentlyWorking`} className="label cursor-pointer flex items-center gap-2">
                                                            <input
                                                                id={`Educations-${index}-IsCurrentlyWorking`}
                                                                type="checkbox"
                                                                className="checkbox rounded-[4px]"
                                                                {...register(`Educations.${index}.isCurrentlyOngoing`)}
                                                                defaultChecked={field.isCurrentlyOngoing}
                                                            />
                                                            <span className="label-text text-white">I Currently Working Here</span>
                                                        </label>
                                                    </div>
                                                    <div className="lg:col-span-3 md:col-span-2">
                                                        <label
                                                            htmlFor={`Experiences-${index}-description`}
                                                            className="label"
                                                        >
                                                            <span className="label-text text-white">
                                                                Description
                                                            </span>
                                                        </label>
                                                        <textarea
                                                            id={`Educations-${index}-description`}
                                                            {...register(`Educations.${index}.description`)}
                                                            className="textarea textarea-bordered w-full bg-base-100 text-white border-gray-500"
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

export default DoctorEducationForm;