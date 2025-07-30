import { UserDto } from '@/types/types';
import axios from 'axios';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface RoleId {
    id?: string;
}

interface UserRoleModalProps {
    inputRoleId: RoleId;
    refetch: () => void | Promise<any>;
}

const UserRoleModal = ({ inputRoleId, refetch }: UserRoleModalProps) => {
    const { id } = inputRoleId;
    const [user, setUser] = useState<UserDto>();
    const [role, setRole] = useState<number>(0);


    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/Users/GetUserById?id=${id}`, { withCredentials: true })
                setUser(data?.data)
            } catch (error: any) {
                console.log(error.message)
            }
        })()
    }, [])


    useEffect(() => {
        if (user?.role) {
            const roleMap: Record<string, number> = {
                "Patient": 1,
                "Receptionist": 2,
                "Accountant": 3,
                "Doctor": 4,
                "Admin": 5,
            };
            setRole(roleMap[user.role]);
        }
    }, [user]);

    const handleUserStatus = async (role: number) => {
        try {
            const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/Users/UpdateRole?id=${id}&role=${role}`, null, {
                withCredentials: true,
            })
            toast.success("User role updated successfully")
            refetch()
            const modalCheckbox = document.getElementById("UserRoleModal") as HTMLInputElement;
            if (modalCheckbox) {
                modalCheckbox.checked = false;
            }
        } catch (error: any) {
            console.log(error?.message)
        }
    }



    return (
        <>
            <input type="checkbox" id={`UserRoleModal`} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box ">
                    <div className="my-4 text-center">
                        <select
                            value={role}
                            onChange={(e) => setRole(Number(e.target.value))}
                            className="select select-primary"
                        >
                            <option disabled={true} value={0}>Select Role</option>
                            <option value={1}>Patient</option>
                            <option value={2}>Receptionist</option>
                            <option value={3}>Accountant</option>
                            <option value={4}>Doctor</option>
                            <option value={5}>Admin</option>
                        </select>

                    </div>
                    <div className="modal-action gap-5 justify-center">
                        <label
                            htmlFor={`UserRoleModal`}
                            className="btn btn-sm btn-success text-neutral"
                        >
                            Cancel
                        </label>
                        <button className="btn btn-sm btn-success text-neutral" onClick={() => handleUserStatus(role)} >
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserRoleModal;