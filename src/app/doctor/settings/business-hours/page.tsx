"use client";
import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { DatePicker, TimePicker, Button } from "antd";
import dayjs from "dayjs";

type BusinessHour = { date: string; from: string; to: string };
type FormData = { BusinessHours: BusinessHour[] };

const DoctorBusinessHoursForm = () => {
    const { control, handleSubmit, watch } = useForm<FormData>({
        defaultValues: { BusinessHours: [{ date: "", from: "", to: "" }] },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "BusinessHours",
    });

    const onSubmit = (data: FormData) => {
        console.log("Doctor Availability:", data);
        alert("Saved successfully!");
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Set Your Availability</h2>
                <Button type="primary" style={{ fontSize: '14px', borderRadius: '0.375rem', fontWeight: "500", backgroundColor: "#1677ff", padding: "10px", height: "45px" }} onClick={() => append({ date: "", from: "", to: "" })}>
                    Add Availability
                </Button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-5">
                {fields.map((field, index) => (
                    <div key={field.id} className="border rounded text-white w-full p-3 flex gap-4 items-end">
                        <div className="grid grid-cols-3 gap-4 w-full">
                            <div className="flex flex-col">
                                <label htmlFor={`BusinessHours.${index}.date`} className="label">
                                    <span className="label-text text-white">Select Date *</span>
                                </label>
                                <Controller name={`BusinessHours.${index}.date`} control={control} rules={{ required: true }} render={({ field }) => (
                                    <DatePicker id={`BusinessHours.${index}.date`} {...field} value={field.value ? dayjs(field.value, "YYYY-MM-DD") : null} format="YYYY-MM-DD" onChange={(date) => field.onChange(date ? date.format("YYYY-MM-DD") : "")}
                                        disabledDate={(current) => {
                                            const cutoff = dayjs().startOf("day");
                                            return current && current.date() < cutoff.date();
                                        }} />
                                )} />
                            </div>


                            <div className="flex flex-col">
                                <label htmlFor={`BusinessHours.${index}.from`} className="label"  >
                                    <span className="label-text text-white">
                                        From Time *
                                    </span>
                                </label>
                                <Controller name={`BusinessHours.${index}.from`} control={control} rules={{ required: true }} render={({ field }) => (
                                    <TimePicker id={`BusinessHours.${index}.from`} {...field} value={field.value ? dayjs(field.value, "HH:mm") : null} format="HH:mm" onChange={(_, timeString) => field.onChange(timeString)}
                                        disabledTime={() => {
                                            const now = dayjs();
                                            return {
                                                disabledHours: () =>
                                                    Array.from({ length: now.hour() }, (_, i) => i),
                                                disabledMinutes: (selectedHour) =>
                                                    selectedHour === now.hour()
                                                        ? Array.from({ length: now.minute() }, (_, i) => i)
                                                        : [],
                                                disabledSeconds: (selectedHour, selectedMinute) =>
                                                    selectedHour === now.hour() && selectedMinute === now.minute()
                                                        ? Array.from({ length: now.second() }, (_, i) => i)
                                                        : [],
                                            };
                                        }} />
                                )}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor={`BusinessHours.${index}.to`} className="label">
                                    <span className="label-text text-white">To Time *</span>
                                </label>
                                <Controller
                                    name={`BusinessHours.${index}.to`}
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => {
                                        const fromTime = watch(`BusinessHours.${index}.from`);
                                        const fromDayjs = fromTime ? dayjs(fromTime, "HH:mm") : null;

                                        return (
                                            <TimePicker
                                                id={`BusinessHours.${index}.to`}
                                                {...field}
                                                value={field.value ? dayjs(field.value, "HH:mm") : null}
                                                format="HH:mm"
                                                onChange={(_, timeString) => field.onChange(timeString)}
                                                disabledTime={(date) => {
                                                    if (!fromDayjs) return { disabledHours: () => [], disabledMinutes: () => [], disabledSeconds: () => [] };
                                                    return {
                                                        disabledHours: () =>
                                                            Array.from({ length: fromDayjs.hour() }, (_, i) => i),
                                                        disabledMinutes: (selectedHour: number) =>
                                                            selectedHour === fromDayjs.hour()
                                                                ? Array.from({ length: fromDayjs.minute() + 1 }, (_, i) => i)
                                                                : [],
                                                        disabledSeconds: () => [],
                                                    };
                                                }}
                                            />
                                        );
                                    }}
                                />



                            </div>
                        </div>

                        <Button type="primary" danger style={{ backgroundColor: fields.length === 1 ? "#f0f0f0" : "" }} onClick={() => remove(index)} disabled={fields.length === 1}  >
                            Delete
                        </Button>
                    </div>
                ))}



                <div className="flex justify-end">
                    <Button type="primary" style={{ fontSize: '14px', borderRadius: '0.375rem', fontWeight: "500", backgroundColor: "#1677ff", padding: "10px", height: "45px" }} htmlType="submit" className="mt-4">
                        Save Availability
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default DoctorBusinessHoursForm;
