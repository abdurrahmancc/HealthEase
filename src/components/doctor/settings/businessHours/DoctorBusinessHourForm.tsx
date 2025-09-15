"use client";
import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { TimePicker, Button } from "antd";
import dayjs from "dayjs";
import { useTimezone } from "@/hooks/useTimezone";
import { DoctorBusinessHour } from "@/types/types";
import axios from "axios";
import { toast } from "react-toastify";

type DoctorBusinessHourFormProps = {
    businessHours: DoctorBusinessHour[] | null
}

const days = [
    { day: "Monday", value: 0 },
    { day: "Tuesday", value: 1 },
    { day: "Wednesday", value: 2 },
    { day: "Thursday", value: 3 },
    { day: "Friday", value: 4 },
    { day: "Saturday", value: 5 },
    { day: "Sunday", value: 6 },
];


const DoctorBusinessHourForm = ({ businessHours }: DoctorBusinessHourFormProps) => {
    const { localToUtcTime, utcToLocalTime } = useTimezone();

    const { control, handleSubmit, watch, reset, setError, formState: { errors } } = useForm<{ BusinessHours: DoctorBusinessHour[][] }>({
        defaultValues: { BusinessHours: days.map(d => [{ businessHourId: "", day: d.day, fromUTC: "", toUTC: "", doctorId: "" }]) }
    });

    const dayFieldArrays = days.map((d, index) => useFieldArray({
        control,
        name: `BusinessHours.${index}` as const
    }));

    const getSafeBusinessHour = (e?: DoctorBusinessHour) => {
        const info = {
            businessHourId: e?.businessHourId || "",
            day: e?.day ?? 0,
            fromUTC: utcToLocalTime(e?.fromUTC) || "",
            toUTC: utcToLocalTime(e?.toUTC) || "",
            doctorId: e?.doctorId || "",
        }
        return (info)
    };



    useEffect(() => {
        if (businessHours) {
            const grouped: DoctorBusinessHour[][] = days.map(() => []);
            businessHours.forEach(slot => {
                const dayIndex = days.findIndex(dayObj => dayObj.value === Number(slot.day));
                if (dayIndex >= 0) grouped[dayIndex].push(getSafeBusinessHour(slot));
            });
            reset({ BusinessHours: grouped });
        }
    }, [businessHours]);



    const onSubmit = async (data: { BusinessHours: DoctorBusinessHour[][] }) => {

        let hasError = false;

        for (let i = 0; i < data.BusinessHours.length; i++) {
            const slots = data.BusinessHours[i]
                .map((s, idx) => ({
                    from: dayjs(s.fromUTC, "HH:mm"),
                    to: dayjs(s.toUTC, "HH:mm"),
                    idx,
                }))
                .sort((a, b) => a.from.valueOf() - b.from.valueOf());

            for (let j = 0; j < slots.length - 1; j++) {
                const current = slots[j];
                const next = slots[j + 1];
                if (current.to.isAfter(next.from)) {
                    setError(`BusinessHours.${i}.${current.idx}.fromUTC` as const, {
                        type: "manual",
                        message: "Overlap with next slot",
                    });
                    setError(`BusinessHours.${i}.${current.idx}.toUTC` as const, {
                        type: "manual",
                        message: "Overlap with next slot",
                    });
                    setError(`BusinessHours.${i}.${next.idx}.fromUTC` as const, {
                        type: "manual",
                        message: "Overlap with previous slot",
                    });
                    setError(`BusinessHours.${i}.${next.idx}.toUTC` as const, {
                        type: "manual",
                        message: "Overlap with previous slot",
                    });
                    hasError = true;
                }
            }
        }

        if (hasError) return;

        const utcSlots = data.BusinessHours.flat().map(slot => ({
            Day: slot.day,
            FromUTC: slot.fromUTC ? localToUtcTime(slot.fromUTC) : "",
            ToUTC: slot.toUTC ? localToUtcTime(slot.toUTC) : "",
            ...(slot.businessHourId ? { BusinessHourId: slot.businessHourId } : {})
        }));


        await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/doctor/AddUpdateBusinessHours`, utcSlots, { withCredentials: true });
        toast.success("Business Hours updated successfully!");

        const response = await fetch(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/Doctor/GetBusinessHours`, { credentials: "include" });
        if (response.ok) {
            const data = await response.json();
            const safeBusinessHours = data.data.map(getSafeBusinessHour);
            const grouped: DoctorBusinessHour[][] = days.map(d => []);
            safeBusinessHours.forEach((slot: DoctorBusinessHour) => {
                const dayIndex = days.findIndex(dayObj => dayObj.value === Number(slot.day));
                const s = getSafeBusinessHour(slot)
                if (dayIndex >= 0) grouped[dayIndex].push(s);
            });
            reset({ BusinessHours: grouped });
        }
    };

    return (
        <div className="p-4 h-[calc(100vh-220px)] overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-5">
                {days.map((day, index) => {
                    const { fields, append, remove } = dayFieldArrays[index];
                    return (
                        <div key={index} className='border-[0.5px] border-gray-800 rounded-[10px] flex gap-10 items-center'>
                            <div className="join join-vertical w-full">
                                <div className="collapse collapse-arrow join-item relative">
                                    <input type="checkbox" />
                                    <div className="collapse-title font-semibold">{day.day}</div>

                                    <div className="flex justify-end mb-2 z-10">
                                        <button
                                            type="button"
                                            className="btn btn-success rounded-[10px] btn-sm absolute top-[14px] right-12"
                                            onClick={() => append({ businessHourId: "", day: day.value, fromUTC: "", toUTC: "", doctorId: "" })}
                                        >
                                            Add Slot
                                        </button>
                                    </div>

                                    <div className="collapse-content px-0 border-t-[0.5px] border-gray-700 !pb-0">
                                        {fields.map((field, idx) => (
                                            <div key={field.id} className='p-5 '>
                                                <div className="flex items-center gap-5 ">
                                                    <div className="grid grid-cols-2 gap-4 w-full items-end">
                                                        <div className="flex flex-col relative">
                                                            <label className="label">
                                                                <span className="label-text text-white">From Time *</span>
                                                            </label>
                                                            <Controller
                                                                name={`BusinessHours.${index}.${idx}.fromUTC` as const}
                                                                control={control}
                                                                rules={{ required: true }}
                                                                render={({ field }) => (
                                                                    <>
                                                                        <TimePicker
                                                                            className="input input-bordered w-full !bg-base-100 !text-white !border-gray-500"
                                                                            {...field}
                                                                            value={field.value ? dayjs(field.value, "HH:mm") : null}
                                                                            format="HH:mm"
                                                                            onChange={(_, timeString) => field.onChange(timeString)}
                                                                        />
                                                                        {errors?.BusinessHours?.[index]?.[idx]?.fromUTC && (
                                                                            <span className="text-red-500 absolute -bottom-5 text-sm">
                                                                                {errors.BusinessHours[index][idx].fromUTC?.message}
                                                                            </span>
                                                                        )}
                                                                    </>
                                                                )}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <label className="label">
                                                                <span className="label-text text-white">To Time *</span>
                                                            </label>
                                                            <Controller
                                                                name={`BusinessHours.${index}.${idx}.toUTC` as const}
                                                                control={control}
                                                                rules={{ required: true }}
                                                                render={({ field }) => {
                                                                    const fromTime = watch(`BusinessHours.${index}.${idx}.fromUTC`);
                                                                    const fromDayjs = fromTime ? dayjs(fromTime, "HH:mm") : null;
                                                                    return (
                                                                        <>
                                                                            <TimePicker
                                                                                className="input input-bordered w-full !bg-base-100 !text-white !border-gray-500"
                                                                                {...field}
                                                                                value={field.value ? dayjs(field.value, "HH:mm") : null}
                                                                                format="HH:mm"
                                                                                onChange={(_, timeString) => field.onChange(timeString)}
                                                                                disabledTime={() => {
                                                                                    if (!fromDayjs) return { disabledHours: () => [], disabledMinutes: () => [], disabledSeconds: () => [] };
                                                                                    return {
                                                                                        disabledHours: () => Array.from({ length: fromDayjs.hour() }, (_, i) => i),
                                                                                        disabledMinutes: (selectedHour: number) =>
                                                                                            selectedHour === fromDayjs.hour() ? Array.from({ length: fromDayjs.minute() + 1 }, (_, i) => i) : [],
                                                                                        disabledSeconds: () => [],
                                                                                    };
                                                                                }}
                                                                            />
                                                                            {errors?.BusinessHours?.[index]?.[idx]?.toUTC && (
                                                                                <span className="text-red-500 absolute -bottom-5 text-sm">
                                                                                    {errors.BusinessHours[index][idx].toUTC?.message}
                                                                                </span>
                                                                            )}
                                                                        </>
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mt-5">
                                                        <button disabled={fields?.length <= 1} type="button" className="btn rounded-[10px] btn-error btn-sm" onClick={() => remove(idx)}>Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div className="flex justify-end">
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="mt-4"
                        style={{ fontSize: '14px', borderRadius: '0.375rem', fontWeight: "500", backgroundColor: "#1677ff", padding: "10px", height: "45px" }}
                    >
                        Save Availability
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default DoctorBusinessHourForm;
