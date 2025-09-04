"use client";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type BusinessHour = { from: string; to: string };
type DayBusinessHours = { day: string; slots: BusinessHour[] };
type FormData = { BusinessHours: DayBusinessHours[] };

const BusinessHoursForm = () => {
    const { control, register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            BusinessHours: days.map(day => ({ day, slots: [{ from: "", to: "" }] })),
        },
    });

    const { fields: dayFields } = useFieldArray({ control, name: "BusinessHours" });

    const onSubmit = (data: FormData) => console.log(data);

    return (
        <div className="h-[calc(100vh-220px)] overflow-y-auto p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
                {dayFields.map((dayField, dayIndex) => {
                    const { fields: slotFields, append: appendSlot, remove: removeSlot } = useFieldArray({
                        control,
                        name: `BusinessHours.${dayIndex}.slots`,
                    });

                    return (
                        <div key={dayField.id} className="border-[0.5px] border-gray-800 rounded-[10px] flex gap-10 items-center">
                            <div className="collapse collapse-arrow join-item relative">
                                <input type="checkbox" id={`day-${dayIndex}`} />
                                <div className="collapse-title font-semibold flex justify-between items-center">
                                    {dayField.day}
                                </div>
                                <div className="flex justify-end mb-2 z-10">
                                    <button type="button" className="btn btn-primary rounded-[10px] btn-sm absolute top-3 right-12" onClick={(e) => { e.stopPropagation(); appendSlot({ from: "", to: "" }); }} >
                                        Add Time Slot
                                    </button>
                                </div>
                                <div className="collapse-content border-t-[0.5px] border-gray-700 !pb-0">
                                    {slotFields.map((slot, slotIndex) => (
                                        <div className="flex gap-5 items-center">
                                            <div key={slot.id} className="grid md:grid-cols-2 gap-4 mb-2 items-end w-full">
                                                <div>
                                                    <label className="label">
                                                        <span className="label-text text-white">From</span>
                                                    </label>
                                                    <input type="time" className="input input-bordered w-full"
                                                        {...register(`BusinessHours.${dayIndex}.slots.${slotIndex}.from` as const, { required: "From is required", })} />
                                                    {errors.BusinessHours?.[dayIndex]?.slots?.[slotIndex]?.from && (
                                                        <p className="text-red-500 text-sm">
                                                            {errors.BusinessHours[dayIndex].slots[slotIndex].from?.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="label">
                                                        <span className="label-text text-white">To</span>
                                                    </label>
                                                    <input type="time" className="input input-bordered w-full"
                                                        {...register(`BusinessHours.${dayIndex}.slots.${slotIndex}.to` as const, { required: "To is required", })} />
                                                    {errors.BusinessHours?.[dayIndex]?.slots?.[slotIndex]?.to && (
                                                        <p className="text-red-500 text-sm">
                                                            {errors.BusinessHours[dayIndex].slots[slotIndex].to?.message}
                                                        </p>
                                                    )}
                                                </div>

                                            </div>
                                            <button type="button" className="btn rounded-[10px] btn-error btn-sm mt-5" onClick={() => removeSlot(slotIndex)} disabled={slotFields.length === 1} >
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div className="flex justify-end mt-4">
                    <button type="submit" className="btn btn-primary rounded-[10px]">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BusinessHoursForm;
