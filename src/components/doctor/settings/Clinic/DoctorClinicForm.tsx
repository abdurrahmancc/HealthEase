'use client'
import UploadImage from '@/components/doctor/settings/basicDetails/UploadImage';
import { DoctorClinic } from '@/types/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';

type Clinic = {
    clinicName: string;
    location: string;
    address: string;
};
type FormData = {
    Clinics: DoctorClinic[];
};

const clinic = {
    clinicName: "",
    location: "",
    address: "",
    clinicLogos: [],
}

type DoctorClinicFormProps = {
    clinics: DoctorClinic[] | null
}


const DoctorClinicForm = ({ clinics }: DoctorClinicFormProps) => {
    const [isLogin, setIsLoading] = useState(false)
    const { register, handleSubmit, control, reset, formState: { errors }, } = useForm<FormData>({ defaultValues: { Clinics: [clinic] } });
    const { fields, append, remove } = useFieldArray({ control, name: "Clinics" })
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [imagesByClinic, setImagesByClinic] = useState<{ [index: number]: File[] }>({});

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
            file.type.startsWith('image/')
        );

        setImagesByClinic((prev) => ({
            ...prev,
            [index]: [...(prev[index] || []), ...droppedFiles],
        }));
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };


    const handleFilesChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        if (!e.target.files) return;
        const newFiles = Array.from(e.target.files);

        setImagesByClinic((prev) => ({
            ...prev,
            [index]: [...(prev[index] || []), ...newFiles],
        }));
    };


    const removeImage = (clinicIndex: number, imageIndex: number) => {
        setImagesByClinic((prev) => {
            const updatedImages = [...(prev[clinicIndex] || [])];
            updatedImages.splice(imageIndex, 1);
            return { ...prev, [clinicIndex]: updatedImages };
        });
    };


    useEffect(() => {
        const urls = images.map((file) => URL.createObjectURL(file));
        setPreviewUrls(urls);

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [images]);



    const getSafeClinic = (e?: DoctorClinic) => ({
        clinicId: e?.clinicId || "",
        clinicName: e?.clinicName || "",
        location: e?.location || "",
        address: e?.address || "",
        doctorId: e?.doctorId || "",
        clinicLogos: e?.clinicLogos || [],
        clinicLogosFile: undefined
    });

    useEffect(() => {
        const defaultClinic: DoctorClinic = {
            clinicId: "",
            clinicName: "",
            location: "",
            address: "",
            doctorId: "",
            clinicLogos: [],
            clinicLogosFile: undefined
        };

        const safeClinics = clinics && clinics.length > 0
            ? clinics.map(getSafeClinic)
            : [defaultClinic];

        reset({ Clinics: safeClinics });
    }, [clinics, reset]);

    const onSubmit = async (data: FormData) => {
        console.log("Form data:", data);
        console.log("Images by clinic:", imagesByClinic);

        const formData = new FormData();
        data.Clinics.forEach((clinic, index) => {
            formData.append(`doctorClinics[${index}].ClinicName`, clinic.clinicName);
            formData.append(`doctorClinics[${index}].Location`, clinic.location);
            formData.append(`doctorClinics[${index}].Address`, clinic.address);

            (clinic.clinicLogos || []).forEach((logo) => {
                formData.append(`doctorClinics[${index}].ClinicLogos`, logo);
            });

            (imagesByClinic[index] || []).forEach(file => {
                formData.append(`doctorClinics[${index}].ClinicLogosFile`, file);
            });
        });


        await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/doctor/AddUpdateClinics`, formData, { withCredentials: true });

        toast.success("Clinics update successfully!");

        const response = await fetch(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/Doctor/GetClinics`, { credentials: "include" });
        if (response.ok) {
            const data = await response.json();
            console.log("data", data)
            const safeClinics = data.data.map(getSafeClinic);
            reset({ Clinics: safeClinics });
            setImagesByClinic({});
        }
    };


    const removeExistingImage = (clinicIndex: number, imageIndex: number) => {
        const updatedLogos = [...(fields[clinicIndex].clinicLogos || [])];
        updatedLogos.splice(imageIndex, 1);

        reset(prev => {
            const newClinics = [...prev.Clinics];
            newClinics[clinicIndex] = { ...newClinics[clinicIndex], clinicLogos: updatedLogos };
            return { Clinics: newClinics };
        });
    };

    return (
        <div className='h-[calc(100vh-220px)] overflow-y-auto p-4'>
            <div>
                <div className='flex justify-between items-center'>
                    <h5 className="text-[18px] font-semibold ">Education</h5>
                    <button className='btn btn-primary  rounded-[10px]' type="button" onClick={() => append(clinic)}>Add New Clinic</button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 ">
                    {
                        fields.map((field, index) => {
                            return (
                                <div key={index} className='border-[0.5px] border-gray-800 rounded-[10px] flex gap-10 items-center'>
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
                                            <div className="collapse-content border-t-[0.5px] border-gray-700 !pb-0">
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
                                                                        address *
                                                                    </span>
                                                                </label>
                                                                <input id={`Clinics-${index}-address`}  {...register(`Clinics.${index}.address`, {
                                                                    required: "address is required",
                                                                })} className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
                                                                {errors.Clinics?.[index]?.address && (
                                                                    <p className="text-red-500 text-sm">
                                                                        {errors.Clinics[index]?.address?.message}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="label-text text-white mb-2">Gallery</div>
                                                        <div onDrop={(e) => handleDrop(e, index)} onDragOver={handleDragOver} className="h-[120px] border-[0.5px] border-gray-800 rounded-[10px] flex justify-center items-center">
                                                            <label htmlFor={`UploadImage-${index}`} className="w-full h-full cursor-pointer flex justify-center items-center" >
                                                                <input onChange={(e) => handleFilesChange(e, index)} multiple type="file" hidden id={`UploadImage-${index}`} accept="image/*" />
                                                                <span className="text-white">
                                                                    Drop files or Click to upload
                                                                </span>
                                                            </label>
                                                        </div>

                                                        <div className="mt-5 flex flex-wrap gap-3">
                                                            {
                                                                field?.clinicLogos && field?.clinicLogos?.length > 0 && field?.clinicLogos.map((logo, imgIndex) => {
                                                                    return (
                                                                        <div key={`${field.clinicName}-${imgIndex}`} className="max-w-[200px] rounded-[10px] p-2 relative shadow-sm border-[0.5px] border-gray-700" >
                                                                            <img className="rounded-[10px] w-full h-[150px] object-cover" src={logo} alt={field.clinicName} />
                                                                            <button type="button" onClick={() => removeExistingImage(index, imgIndex)} className="absolute cursor-pointer top-2 right-2 bg-gray-100 p-1 rounded-full" >
                                                                                <IoClose className="text-black" />
                                                                            </button>
                                                                        </div>
                                                                    );
                                                                })
                                                            }
                                                            {(imagesByClinic[index] || []).map((file, imgIndex) => {
                                                                const previewUrl = URL.createObjectURL(file);
                                                                return (
                                                                    <div key={`${file.name}-${imgIndex}`} className="max-w-[200px] rounded-[10px] p-2 relative shadow-sm border-[0.5px] border-gray-700" >
                                                                        <img className="rounded-[10px] w-full h-[150px] object-cover" src={previewUrl} alt={file.name} onLoad={() => URL.revokeObjectURL(previewUrl)} />
                                                                        <button type="button" onClick={() => removeImage(index, imgIndex)} className="absolute cursor-pointer top-2 right-2 bg-gray-100 p-1 rounded-full" >
                                                                            <IoClose className="text-black" />
                                                                        </button>
                                                                    </div>
                                                                );
                                                            })}
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

export default DoctorClinicForm;