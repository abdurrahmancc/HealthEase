// hooks/useLoginUser.ts
"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export interface UserDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    role: string;
    photoUrl: string;
}

export const useLoginUser = () => {
    const [user, setUser] = useState<UserDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("https://localhost:7155/v1/api/User/GetLoginUser", {
                    withCredentials: true,
                });

                if (response.status === 200 && response.data.success) {
                    setUser(response.data.data);
                } else {
                    setError("Failed to fetch user");
                }
            } catch (err: any) {
                setError(err.message || "Error fetching user");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading, error };
};
