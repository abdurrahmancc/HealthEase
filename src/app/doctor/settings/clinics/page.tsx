"use client"
import UploadImage from '@/components/doctor/settings/basicDetails/UploadImage';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';


type Clinic = {
    clinicName: string;
    location: string;
    addrerss: string;
};
type FormData = {
    Clinics: Clinic[];
};

const education = {
    clinicName: "",
    location: "",
    addrerss: "",
}

const Clinics = () => {
    const [isLogin, setIsLoading] = useState(false)
    const { register, handleSubmit, control, formState: { errors }, } = useForm<FormData>({ defaultValues: { Clinics: [education] } });
    const { fields, append, remove } = useFieldArray({ control, name: "Clinics" })
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newFiles = Array.from(e.target.files);
        setImages((prev) => [...prev, ...newFiles]);
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    // Generate preview URLs & revoke on cleanup
    useEffect(() => {
        const urls = images.map((file) => URL.createObjectURL(file));
        setPreviewUrls(urls);

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [images]);

    const onSubmit = (data: FormData) => {
        console.log(data);
    };
    return (
        <div className='h-[calc(100vh-220px)] overflow-y-auto p-4'>
            <div>
                <div className='flex justify-between items-center'>
                    <h5 className="text-[18px] font-semibold ">Education</h5>
                    <button className='btn btn-primary  rounded-[10px]' type="button" onClick={() => append(education)}>Add New Education</button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 ">
                    {
                        fields.map((field, index) => (
                            <div key={index} className='border-[0.5px] border-gray-800 rounded-[10px] flex gap-10 items-center mt-5'>
                                <div className="join join-vertical w-full">
                                    <div className="collapse collapse-arrow join-item relative">
                                        <input id={`Clinic-${index}-toggle`} defaultChecked type="checkbox" />
                                        <div className="collapse-title font-semibold">
                                            Clinic
                                        </div>

                                        <div className="flex justify-end mb-2 z-10">
                                            <button disabled={fields.length == 1} type="button" className="btn btn-error rounded-[10px] btn-sm absolute top-3 right-12" onClick={() => remove(index)} >
                                                Delete
                                            </button>
                                        </div>
                                        <div className="collapse-content border-t-[0.5px] border-gray-700 ">
                                            <div className='flex gap-10 items-center pt-4'>
                                                <UploadImage title='Logo' />
                                            </div>
                                            <div className='pt-5'>
                                                <div key={field.id} className="grid md:grid-cols-2 lg:grid-cols-3 w-full gap-[20px] mb-5" >
                                                    <div className='lg:col-span-3 md:col-span-2 grid md:grid-cols-2 md: gap-[20px]'>
                                                        <div>
                                                            <label htmlFor={`Clinics-${index}-title`} className="label"  >
                                                                <span className="label-text text-white">
                                                                    Clinic Name *
                                                                </span>
                                                            </label>
                                                            <input id={`Clinics-${index}-title`}  {...register(`Clinics.${index}.clinicName`, { required: "Clinic name is required", })}
                                                                className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
                                                            {errors.Clinics?.[index]?.clinicName && (
                                                                <p className="text-red-500 text-sm">
                                                                    {errors.Clinics[index]?.clinicName?.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label htmlFor={`Clinics-${index}-location`} className="label" >
                                                                <span className="label-text text-white">
                                                                    Location *
                                                                </span>
                                                            </label>
                                                            <input id={`Clinics-${index}-location`}  {...register(`Clinics.${index}.location`, {
                                                                required: "Location is required",
                                                            })} className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
                                                            {errors.Clinics?.[index]?.location && (
                                                                <p className="text-red-500 text-sm">
                                                                    {errors.Clinics[index]?.location?.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label htmlFor={`Clinics-${index}-location`} className="label" >
                                                                <span className="label-text text-white">
                                                                    Addrerss *
                                                                </span>
                                                            </label>
                                                            <input id={`Clinics-${index}-addrerss`}  {...register(`Clinics.${index}.addrerss`, {
                                                                required: "Addrerss is required",
                                                            })} className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
                                                            {errors.Clinics?.[index]?.addrerss && (
                                                                <p className="text-red-500 text-sm">
                                                                    {errors.Clinics[index]?.addrerss?.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="label-text text-white mb-2">Gallery</div>
                                                    <div className="h-[120px] border-[0.5px] border-gray-800 rounded-[10px] flex justify-center items-center">
                                                        <label
                                                            htmlFor="UploadImage"
                                                            className="w-full h-full cursor-pointer flex justify-center items-center"
                                                        >
                                                            <input
                                                                onChange={handleFilesChange}
                                                                multiple
                                                                type="file"
                                                                hidden
                                                                id="UploadImage"
                                                                accept="image/*"
                                                            />
                                                            <span className="text-white">Drop files or Click to upload</span>
                                                        </label>
                                                    </div>

                                                    <div className="mt-5 flex flex-wrap gap-3">
                                                        {previewUrls.map((url, index) => (
                                                            <div
                                                                key={index}
                                                                className="max-w-[200px] rounded-[10px] p-2 relative shadow-sm border-[0.5px] border-gray-700"
                                                            >
                                                                <img
                                                                    className="rounded-[10px] w-full h-[150px] object-cover"
                                                                    src={url}
                                                                    alt={images[index].name}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeImage(index)}
                                                                    className="absolute top-2 right-2 bg-gray-100 p-1 rounded-full"
                                                                >
                                                                    <IoClose className="text-black" />
                                                                </button>
                                                            </div>
                                                        ))}
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

export default Clinics;