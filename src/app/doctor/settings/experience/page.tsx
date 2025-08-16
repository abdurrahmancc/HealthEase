"use client"
import UploadImage from '@/components/doctor/settings/basicDetails/UploadImage';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';


type Experience = {
    title: string;
    hospital: string;
    yearofExperience: string;
    location: string;
    employment: string;
    jobDescription: string;
    startDate: string
    endDate: string;
    IsCurrentlyWorking: boolean;
};
type FormData = {
    Experiences: Experience[];
};

const experience = {
    title: "",
    hospital: "",
    yearofExperience: "",
    location: "",
    employment: "",
    jobDescription: "",
    startDate: "",
    endDate: "",
    IsCurrentlyWorking: false,
}

const DoctorExperience = () => {
    const [isLogin, setIsLoading] = useState(false)
    const { register, handleSubmit, control, formState: { errors }, } = useForm<FormData>({ defaultValues: { Experiences: [experience] } });
    const { fields, append, remove } = useFieldArray({ control, name: "Experiences" })

    const onSubmit = (data: FormData) => {
        console.log(data);
    };
    return (
        <div className='h-[calc(100vh-220px)] overflow-y-auto p-4'>
            <div>
                <div className='flex justify-between items-center'>
                    <h5 className="text-[18px] font-semibold ">Experience</h5>
                    <button className='btn btn-primary  rounded-[10px]' type="button" onClick={() => append(experience)}>Add New Experience</button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 ">
                    {
                        fields.map((field, index) => (
                            <div key={index} className='border-[0.5px] border-gray-800 rounded-[10px] flex gap-10 items-center mt-5'>
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
                                        <div className="collapse-content border-t-[0.5px] border-gray-700 ">
                                            <div className='flex gap-10 items-center pt-4'>
                                                <UploadImage title='Hospital Logo' />
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
                                                        <input id={`Experiences-${index}-yearofExperience`}  {...register(`Experiences.${index}.yearofExperience`,
                                                            { required: "Years of experience is required" })}
                                                            className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
                                                        {errors.Experiences?.[index]?.yearofExperience && (
                                                            <p className="text-red-500 text-sm">
                                                                {errors.Experiences[index]?.yearofExperience?.message}
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
                                                            <label htmlFor={`Experiences-${index}-employment`} className="label" >
                                                                <span className="label-text text-white">
                                                                    Employment Type *
                                                                </span>
                                                            </label>
                                                            <input id={`Experiences-${index}-employment`}  {...register(`Experiences.${index}.employment`, { required: "Employment type is required", })}
                                                                className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
                                                            {errors.Experiences?.[index]?.employment && (
                                                                <p className="text-red-500 text-sm">
                                                                    {errors.Experiences[index]?.employment?.message}
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
                                                            defaultValue={field.startDate
                                                                ? new Date(field.startDate).toISOString().split("T")[0]
                                                                : ""}
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
                                                            {...register(`Experiences.${index}.endDate`, { required: "End date is required" })}
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
                                                                {...register(`Experiences.${index}.IsCurrentlyWorking`)}
                                                                defaultChecked={field.IsCurrentlyWorking}
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
                        ))}
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

export default DoctorExperience;