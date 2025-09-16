"use client"
import axios from 'axios'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

type FormData = {
  CurrentPassword: string,
  NewPassword: string,
  ConfirmPassword: string
}

const ChangePassword = () => {
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      if (data.NewPassword !== data.ConfirmPassword) {
        setError("ConfirmPassword", { message: "New Passoword and confirm passoword is do not match" })
        return;
      }
      await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/Users/ChangePassword`, data, { withCredentials: true });
      toast.success("Password Updated")
    } catch (error: any) {
      const errors = error?.response?.data?.errors;
      if (Array.isArray(errors)) {
        errors.forEach((err: string) => toast.error(err));
      } else {
        toast.error("Something went wrong");
      }
    }

  }

  return (
    <div className="p-4 h-[calc(100vh-220px)] overflow-y-auto">
      <h5 className='text-[18px] font-semibold mb-5'>Change Passoword</h5>
      <div className='p-2 border-[0.5px] border-gray-700 rounded-[10px]'>
        <form className='p-4' onSubmit={handleSubmit(onSubmit)}>
          <div className='grid md:grid-cols-2 grid-cols-1 w-full gap-[20px]'>
            <div>
              <label htmlFor='CurrentPassword' className="label">
                <span className="label-text text-white">Current Password *</span>
              </label>
              <input id='CurrentPassword' {...register("CurrentPassword", { required: "Current Password  is required" })}
                className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
              {errors.CurrentPassword && <p className="text-red-500 text-sm">{errors.CurrentPassword.message}</p>}
            </div>
            <div>
              <label htmlFor='NewPassword' className="label">
                <span className="label-text text-white">New Password *</span>
              </label>
              <input minLength={6} id='NewPassword' {...register("NewPassword", { required: "New Password  is required" })}
                className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
              {errors.NewPassword && <p className="text-red-500 text-sm">{errors.NewPassword.message}</p>}
            </div>
            <div>
              <label htmlFor='CofirmPassword' className="label">
                <span className="label-text text-white">Confirm Password *</span>
              </label>
              <input minLength={6} id='ConfirmPassword' {...register("ConfirmPassword", { required: "Confirm Password  is required" })}
                className="input input-bordered w-full bg-base-100 text-white border-gray-500" />
              {errors.ConfirmPassword && <p className="text-red-500 text-sm">{errors.ConfirmPassword.message}</p>}
            </div>
          </div>
          <div className='flex justify-end'>
            <button className='btn btn-success rounded-[10px]' type='submit'>Change Passowrd</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword