'use client'
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { DoctorExperience } from '@/types/types';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import axios from 'axios';



type FormData = {
    Experiences: DoctorExperience[];
};

const experience: DoctorExperience = {
    title: "",
    hospital: "",
    yearOfExperience: "",
    location: "",
    employmentType: "",
    jobDescription: "",
    startDate: "",
    endDate: "",
    isCurrentlyWorking: false,
};


type DoctorExperienceFormProps = {
    experiences: DoctorExperience[] | null
}

interface DoctorExperienceFormData {
    Experiences: DoctorExperience[];
}

const DoctorExperienceForm = ({ experiences }: DoctorExperienceFormProps) => {
    const [uploadLoading, setUploadLoading] = useState(false)
    const [isLogin, setIsLoading] = useState(false)
    const { register, handleSubmit, control, setValue, reset, watch, formState: { errors }, } = useForm<FormData>({ defaultValues: { Experiences: [experience] } });
    const { fields, append, remove } = useFieldArray({ control, name: "Experiences" })
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const getSafeExperience = (e?: DoctorExperience) => ({
        experienceId: e?.experienceId || "",
        title: e?.title || "",
        hospital: e?.hospital || "",
        yearOfExperience: e?.yearOfExperience || "",
        location: e?.location || "",
        employmentType: e?.employmentType || "",
        jobDescription: e?.jobDescription || "",
        startDate: e?.startDate ? new Date(e.startDate).toISOString().split("T")[0] : "",
        endDate: e?.endDate ? new Date(e.endDate).toISOString().split("T")[0] : "",
        isCurrentlyWorking: e?.isCurrentlyWorking ?? false,
        doctorId: e?.doctorId || "",
        hospitalLogo: e?.hospitalLogo || "",
        hospitalLogoFile: undefined
    });

    useEffect(() => {
        const defaultExperience: DoctorExperience = {
            experienceId: "",
            title: "",
            hospital: "",
            yearOfExperience: "",
            location: "",
            employmentType: "",
            jobDescription: "",
            startDate: "",
            endDate: "",
            isCurrentlyWorking: false,
            doctorId: "",
            hospitalLogo: "",
            hospitalLogoFile: undefined
        };

        const safeExperiences = experiences && experiences.length > 0
            ? experiences.map(getSafeExperience)
            : [defaultExperience];

        reset({ Experiences: safeExperiences });
    }, [experiences, reset]);

    const onSubmit = async (data: DoctorExperienceFormData) => {
        try {
            setUploadLoading(true);
            setIsLoading(true)
            const formData = new FormData();
            data.Experiences.forEach((exp, index) => {
                formData.append(`doctorExperience[${index}].title`, exp.title || "");
                formData.append(`doctorExperience[${index}].hospital`, exp.hospital || "");
                formData.append(`doctorExperience[${index}].yearOfExperience`, exp.yearOfExperience || "");
                formData.append(`doctorExperience[${index}].location`, exp.location || "");
                formData.append(`doctorExperience[${index}].employmentType`, exp.employmentType || "");
                formData.append(`doctorExperience[${index}].jobDescription`, exp.jobDescription || "");
                formData.append(`doctorExperience[${index}].startDate`, exp.startDate || "");
                formData.append(`doctorExperience[${index}].endDate`, exp.endDate || "");
                formData.append(`doctorExperience[${index}].isCurrentlyWorking`, exp.isCurrentlyWorking ? "true" : "false");

                if (exp.hospitalLogo) {
                    formData.append(`doctorExperience[${index}].hospitalLogo`, exp.hospitalLogo);
                }

                if (exp.hospitalLogoFile) {
                    formData.append(`doctorExperience[${index}].hospitalLogoFile`, exp.hospitalLogoFile);
                }

                if (exp.experienceId) {
                    formData.append(`doctorExperience[${index}].experienceId`, exp.experienceId);
                }
            });



            await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/doctor/AddUpdateExperience`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            });

            toast.success("Experiences saved successfully!");

            const response = await fetch(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/Doctor/GetExperiences`, { credentials: "include" });
            if (response.ok) {
                const data = await response.json();
                const safeExperiences = data.data.map(getSafeExperience);
                reset({ Experiences: safeExperiences });
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.errors[0] || "Something went wrong");
        } finally {
            setUploadLoading(false);
            setPreviewUrl(null);
            setIsLoading(false)
        }
    };


    const handleUploadPhotoUrl = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        if (file) {
            setValue(`Experiences.${index}.hospitalLogoFile`, file);
        }
    };

    return (
        <div className='h-[calc(100vh-220px)] overflow-y-auto p-4'>
            <div>
                <div className='flex justify-between items-center'>
                    <h5 className="text-[18px] font-semibold ">Experience</h5>
                    <button className='btn btn-primary  rounded-[10px]' type="button" onClick={() => append(experience)}>Add New Experience</button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 ">
                    {fields.map((field, index) => {
                        const isWorking = watch(`Experiences.${index}.isCurrentlyWorking`);
                        return (
                            <div key={index} className='border-[0.5px] border-gray-800 rounded-[10px] flex gap-10 items-center'>
                                <div className="join join-vertical w-full">
                                    <div className="collapse collapse-arrow join-item relative">
                                        <input id={`Experiences-${index}-toggle`} defaultChecked type="checkbox" />
                                        <div className="collapse-title font-semibold">
                                            Experience
                                        </div>

                                        <div className="flex justify-end mb-2 z-10">
                                            <button disabled={fields.length == 1} type="button" className="btn btn-error rounded-[10px] btn-sm absolute top-3 right-12" onClick={() => remove(index)} >
                                                Delete
                                            </button>
                                        </div>
                                        <div className="collapse-content border-t-[0.5px] border-gray-700 !pb-0">
                                            <div className='flex gap-10 items-center pt-4'>
                                                <div className='w-[120px] h-[120px] border-[0.5px] border-gray-800 rounded-[10px] flex justify-center items-center overflow-hidden relative'>
                                                    {
                                                        uploadLoading ? <span className="btn-loading !w-[16px] !h-[16px]"></span> : <label htmlFor={`Experiences-${index}-UploadImage`} className='w-full relative h-full cursor-pointer flex justify-center items-center'>
                                                            <input id={`Experiences-${index}-UploadImage`} onChange={(e) => handleUploadPhotoUrl(e, index)} type="file" hidden />
                                                            {field?.hospitalLogo ? (
                                                                <Image src={previewUrl ? previewUrl : field?.hospitalLogo} alt="Profile Picture" priority style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100px, 120px" fill />
                                                            ) : (
                                                                <ImageIcon className='text-gray-600' />
                                                            )}
                                                        </label>
                                                    }
                                                </div>

                                                <div>
                                                    <h5 className='text-[18px] font-semibold'>Hospital Logo</h5>
                                                    <p className='mt-3'>Your Image should Below 500 kb, Accepted format jpg,png</p>
                                                </div>
                                            </div>
                                            <div className='pt-5'>
                                                <div key={field.id} className="grid md:grid-cols-2 lg:grid-cols-3 w-full gap-[20px] mb-5" >
                                                    <div>
                                                        <label htmlFor={`Experiences-${index}-title`} className="label"  >
                                                            <span className="label-text text-white">
                                                                Title *
                                                            </span>
                                                        </label>
                                                        <input id={`Experiences-${index}-title`}  {...register(`Experiences.${index}.title`, { required: "Title is required", })}
                                                            className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
                                                        {errors.Experiences?.[index]?.title && (
                                                            <p className="text-red-500 text-sm">
                                                                {errors.Experiences[index]?.title?.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label htmlFor={`Experiences-${index}-hospital`} className="label" >
                                                            <span className="label-text text-white">
                                                                Hospital *
                                                            </span>
                                                        </label>
                                                        <input id={`Experiences-${index}-hospital`}  {...register(`Experiences.${index}.hospital`, {
                                                            required: "Hospital is required",
                                                        })} className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
                                                        {errors.Experiences?.[index]?.hospital && (
                                                            <p className="text-red-500 text-sm">
                                                                {errors.Experiences[index]?.hospital?.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label htmlFor={`Experiences-${index}-yearofExperience`} className="label"  >
                                                            <span className="label-text text-white">
                                                                Years of Experience *
                                                            </span>
                                                        </label>
                                                        <input id={`Experiences-${index}-yearofExperience`}  {...register(`Experiences.${index}.yearOfExperience`,
                                                            { required: "Years of experience is required" })}
                                                            className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
                                                        {errors.Experiences?.[index]?.yearOfExperience && (
                                                            <p className="text-red-500 text-sm">
                                                                {errors.Experiences[index]?.yearOfExperience?.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className='lg:col-span-3 md:col-span-2 grid md:grid-cols-2 md: gap-[20px]'>
                                                        <div>
                                                            <label htmlFor={`Experiences-${index}-location`} className="label"  >
                                                                <span className="label-text text-white">
                                                                    Location *
                                                                </span>
                                                            </label>
                                                            <input id={`Experiences-${index}-location`}  {...register(`Experiences.${index}.location`, { required: "Location is required", })}
                                                                className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
                                                            {errors.Experiences?.[index]?.location && (
                                                                <p className="text-red-500 text-sm">
                                                                    {errors.Experiences[index]?.location?.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label htmlFor={`Experiences-${index}-employmentType`} className="label" >
                                                                <span className="label-text text-white">
                                                                    Employment Type *
                                                                </span>
                                                            </label>
                                                            <select
                                                                id={`Experiences-${index}-employmentType`}
                                                                {...register(`Experiences.${index}.employmentType`, { required: "Employment type is required" })}
                                                                className="select w-full bg-base-100 text-white border-gray-500"
                                                                defaultValue={field.employmentType || ""}
                                                            >
                                                                <option value="">Select Employment Type</option>
                                                                <option value="1">Full Time</option>
                                                                <option value="2">Part Time</option>
                                                            </select>

                                                            {errors.Experiences?.[index]?.employmentType && (
                                                                <p className="text-red-500 text-sm">
                                                                    {errors.Experiences[index]?.employmentType?.message}
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
                                                            {...register(`Experiences.${index}.startDate`, { required: "Start date is required" })}
                                                            defaultValue={field.startDate ? new Date(field.startDate).toISOString().split("T")[0] : ""}
                                                        />
                                                        {errors.Experiences?.[index]?.startDate && (
                                                            <p className="text-red-500 text-sm">{errors.Experiences[index]?.startDate?.message}</p>
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
                                                            {...register(`Experiences.${index}.endDate`, { required: !isWorking ? "End date is required" : false })}
                                                            disabled={isWorking}
                                                            defaultValue={field.endDate
                                                                ? new Date(field.endDate).toISOString().split("T")[0]
                                                                : ""}
                                                        />
                                                        {errors.Experiences?.[index]?.endDate && (
                                                            <p className="text-red-500 text-sm">{errors.Experiences[index]?.endDate?.message}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center mt-5">
                                                        <label htmlFor={`Experiences-${index}-IsCurrentlyWorking`} className="label cursor-pointer flex items-center gap-2">
                                                            <input
                                                                id={`Experiences-${index}-IsCurrentlyWorking`}
                                                                type="checkbox"
                                                                className="checkbox rounded-[4px]"
                                                                {...register(`Experiences.${index}.isCurrentlyWorking`)}
                                                                defaultChecked={field.isCurrentlyWorking}
                                                            />
                                                            <span className="label-text text-white">I Currently Working Here</span>
                                                        </label>
                                                    </div>
                                                    <div className="lg:col-span-3  md:col-span-2">
                                                        <label
                                                            htmlFor={`Experiences-${index}-jobDescription`}
                                                            className="label"
                                                        >
                                                            <span className="label-text text-white">
                                                                Job Description
                                                            </span>
                                                        </label>
                                                        <textarea
                                                            id={`Experiences-${index}-jobDescription`}
                                                            {...register(`Experiences.${index}.jobDescription`)}
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
}
export default DoctorExperienceForm;