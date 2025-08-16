import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';


type Membership = {
    title: string;
    about: string;
};

type FormData = {
    memberships: Membership[];
};

const Memberships = () => {
    const [isLogin, setIsLogin] = useState(false);
    const { register, handleSubmit, control, formState: { errors }, } = useForm<FormData>({ defaultValues: { memberships: [{ title: "", about: "" }] } });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "memberships",
    });

    console.log("fields", fields)
    const onSubmit = (data: FormData) => {
        console.log(data);
    };
    return (
        <div>
            <h5 className="text-[18px] font-semibold mb-5">Memberships</h5>
            <div className="p-2 border-[0.5px] border-gray-700 rounded-[10px]">
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 ">
                    <div className="grid gap-5">
                        {fields.map((field, index) => (
                            <div key={field.id}   className="grid md:grid-cols-2 lg:grid-cols-3 w-full gap-[20px] items-end">
                                <div>
                                    <label htmlFor={`memberships-${index}-title`} className="label">
                                        <span className="label-text text-white">Title *</span>
                                    </label>
                                    <input  id={`memberships-${index}-title`} {...register(`memberships.${index}.title`, { required: "Title is required"})}
                                        className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
                                    {errors.memberships?.[index]?.title && ( <p className="text-red-500 text-sm"> {errors.memberships[index]?.title?.message} </p> )}
                                </div>

                                <div className="col-span-2 flex items-end gap-5">
                                    <div className="w-full">
                                        <label htmlFor={`memberships-${index}-about`} className="label">
                                            <span className="label-text text-white">About *</span>
                                        </label>
                                        <input id={`memberships-${index}-about`} {...register(`memberships.${index}.about`, { required: "About is required",})}
                                            className="input input-bordered w-full bg-base-100 text-white border-gray-500"  />
                                        {errors.memberships?.[index]?.about && ( <p className="text-red-500 text-sm">  {errors.memberships[index]?.about?.message} </p> )}
                                    </div>
                                    <button type="button"  className="btn btn-error rounded-[10px]" disabled={fields.length == 1}  onClick={() => remove(index)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add + Submit buttons */}
                    <div className="flex justify-end gap-5 ml-auto mt-5">
                        <button type="button" className="btn btn-primary rounded-[10px]"  onClick={() => append({ title: "", about: "" })} >
                            Add New
                        </button>
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