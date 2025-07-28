"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { setCookie } from "@/hooks/useCookies";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter()

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLogin(true);
    try {
      const response = await axios.post("https://localhost:7155/v1/api/login", data);
      if (response.status === 200) {
        const token = response.data.data.token;
       await setCookie(token);
        router.push("/patient");
      } else {
        toast.error("Login failed: Invalid credentials");
      }
    } catch (error: any) {
      console.log(error)
      toast.error("Login failed: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLogin(false);
    }
  };

  const handleAdminLogin = (email: string, password: string) => {
    onSubmit({ email, password });
  };

  const handleAgentLogin = (email: string, password: string) => {
    onSubmit({ email, password });
  };

  const handleCustomerLogin = (email: string, password: string) => {
    onSubmit({ email, password });
  };

  return (
    <div className="min-h-[calc(100vh-117px)] flex items-center justify-center bg-base-100">
      <div className="w-full max-w-md bg-base-300 text-black shadow-2xl p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/*=========== Email ==========*/}
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
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-error text-sm">{errors.email.message}</p>
            )}
          </div>

          {/*=========== Password ==========*/}
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
          {/*=========== Submit Button ==========*/}

          <button type="submit" className="btn btn-primary w-full">
            {isLogin ? (
              <span className="loading loading-spinner  loading-sm"></span>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-white">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary font-medium">
            Sign up
          </Link>
        </p>

        <div className="flex justify-center gap-5 mt-5">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => handleAdminLogin("admin@gmail.com", "admin@")}
          >
            Admin
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() =>
              handleAgentLogin("patient@gmail.com", "patient@")
            }
          >
            patient
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() =>
              handleCustomerLogin("doctor@gmail.com", "doctor@")
            }
          >
            Doctor
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
