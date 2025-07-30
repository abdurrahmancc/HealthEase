"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
    const [isLogin, setIsLogin] = useState(false);
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  //   const router = useRouter();
  const password = watch("password");

const onSubmit = async (data: RegisterFormData) => {
   setIsLogin(true);
  if (data.password !== data.confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/register`, data);
    if (response.status === 200) {
      toast.success("Registration successfull")
      router.push("/login");
    } else {
      toast.error("Registration failed");
    }
  } catch (error: any) {
    console.log(error);
    toast.error("Registration failed: " + (error?.response?.data?.message || error?.message));
  }finally {
      setIsLogin(false);
    }
};


  return (
    <div className="min-h-[calc(100vh-117px)] flex items-center justify-center bg-base-100">
      <div className="w-full max-w-md bg-base-300 text-white shadow-2xl p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/*================ Full Name ================ */}
          <div>
            <label className="label">
              <span className="label-text text-white">First Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter Your first name"
              className="input input-bordered w-full bg-base-100 text-white border-gray-500"
              {...register("firstName", { required: "First name is required" })}
            />
            {errors.firstName && (
              <p className="text-error text-sm">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text text-white">Last Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter Your last name"
              className="input input-bordered w-full bg-base-100 text-white border-gray-500"
              {...register("lastName", { required: "Last name is required" })}
            />
            {errors.lastName && (
              <p className="text-error text-sm">{errors.lastName.message}</p>
            )}
          </div>
          {/*================  Email ================ */}
          <div>
            <label className="label">
              <span className="label-text text-white">Email Address</span>
            </label>
            <input
              type="email"
              placeholder="Your email"
              className="input input-bordered w-full bg-base-100 text-white border-gray-500"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-error text-sm">{errors.email.message}</p>
            )}
          </div>

          {/*================  Password ================ */}
          <div>
            <label className="label">
              <span className="label-text text-white">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="input input-bordered w-full bg-base-100 text-white border-gray-500"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-error text-sm">{errors.password.message}</p>
            )}
          </div>

          {/*================  Confirm Password ================ */}
          <div>
            <label className="label">
              <span className="label-text text-white">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              className="input input-bordered w-full bg-base-100 text-white border-gray-500"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-error text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-full">
            {isLogin ? (
              <span className="loading loading-spinner  loading-sm"></span>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-white">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
