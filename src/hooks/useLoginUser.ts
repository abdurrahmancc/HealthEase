// hooks/useLoginUser.ts
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { UserDto } from "@/types/types";


export const useLoginUser = () => {
    const [user, setUser] = useState<UserDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshGetLoginUser, setRefreshGetLoginUser] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/Users/GetLoginUser`, {
                    withCredentials: true,
                });

                if (response.status === 200 && response.data.success) {
                    setUser(response.data.data);
                } else {
                    setError("Failed to fetch user");
                }
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.message || err.message);
                } else if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Unknown error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [refreshGetLoginUser]);

    return { user, loading, error, setRefreshGetLoginUser };
};
