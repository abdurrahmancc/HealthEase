"use client"
import React, { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { SocialMideaType } from '@/types/types';
import axios from 'axios';

const socialMediaOptions = [
    { name: "LinkedIn", value: 1 },
    { name: "Twitter", value: 2 },
    { name: "Instagram", value: 3 },
    { name: "Facebook", value: 4 }
];

type FormValues = {
    socialMedia: SocialMideaType[];
};

type SocialMediaFormProps = {
    socials: SocialMideaType[] | null
}

const SocialMediaForm = ({ socials }: SocialMediaFormProps) => {
    const { control, register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();

    const { fields, append, remove  } = useFieldArray({ control, name: "socialMedia" });

    const getSafeSocials = (e?: SocialMideaType) => ({
        id: e?.id || "",
        socialMedia: e?.socialMedia || "",
        link: e?.link || "",
        doctorId: e?.doctorId || "",
    });

    useEffect(() => {
        const safeSocials = socials && socials?.length > 0
            ? socials?.map(getSafeSocials)
            : [{ id: "", socialMedia: "", link: '', doctorId: "" }];

        reset({ socialMedia: safeSocials });
    }, [socials]);

    const onSubmit = async (data: FormValues) => {
        try {
            const filteredData = data.socialMedia.map(item => {
                if (item.id) {
                    return { id: item.id, socialMedia: item.socialMedia, link: item.link, doctorId: item.doctorId };
                } else {
                    return { socialMedia: item.socialMedia, link: item.link };
                }
            });

            const { data: res } = await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/doctor/AddUpdateSocialMidea`, filteredData, { withCredentials: true });
            const safeSocials = res.data && res.data.length > 0 ?  res.data?.map(getSafeSocials) : [{ id: "", socialMedia: "", link: '', doctorId: "" }];

            reset({ socialMedia: safeSocials });
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className="p-4 h-[calc(100vh-220px)] overflow-y-auto">
            <div className='flex justify-between items-center mb-5'>
                <h5 className='text-[18px] font-semibold'>Social Media Links</h5>
                <button
                    type="button"
                    className='btn btn-success rounded-[10px]'
                    onClick={() => append({ id: "", socialMedia: "LinkedIn", link: "", doctorId: "" })}
                >
                    Add new social media
                </button>
            </div>
            <div className='p-2 border-[0.5px] border-gray-700 rounded-[10px]'>
                <form className='p-4' onSubmit={handleSubmit(onSubmit)}>
                    {fields.map((field, index) => (
                        <div key={field.id} className='flex items-center w-full gap-[20px] mb-4'>
                            <Controller
                                name={`socialMedia.${index}.socialMedia`}
                                control={control}
                                render={({ field }) => (
                                    <select {...field} className="select">
                                        {socialMediaOptions.map(opt => (
                                            <option key={opt.value} value={opt.name}>{opt.name}</option>
                                        ))}
                                    </select>
                                )}
                            />

                            <div className="flex-1">
                                <input
                                    placeholder='Link *'
                                    id={`Link-${index}`}
                                    {...register(`socialMedia.${index}.link`, { required: "Link is required" })}
                                    className="input input-bordered w-full bg-base-100 text-white border-gray-500"
                                />
                                {errors.socialMedia?.[index]?.link && (
                                    <p className="text-red-500 text-sm">
                                        {errors.socialMedia[index]?.link?.message}
                                    </p>
                                )}
                            </div>
                            <button className='btn btn-error rounded-[10px]' onClick={() => remove(index)} disabled={fields.length == 1}  >Delete</button>
                        </div>
                    ))}

                    <div className='flex justify-end'>
                        <button className='btn btn-success rounded-[10px]' type='submit'>Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SocialMediaForm;
