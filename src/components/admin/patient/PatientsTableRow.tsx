import { User } from '@/types/types';
import React, { Dispatch, DispatchWithoutAction, SetStateAction } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { FiEdit } from 'react-icons/fi';
import { MdDelete, MdDetails } from 'react-icons/md';


interface RoleId {
    id?: string;
}

interface UsersTableRowProps {
    user: User;
    index: number;
    setDeleteModal: Dispatch<SetStateAction<string | null | User>>;
    setInputRoleId: Dispatch<SetStateAction<RoleId>>;
}

const PatientsTableRow = ({ user, index, setDeleteModal, setInputRoleId }: UsersTableRowProps) => {
    return (
        <tr>
            <td>{index + 1}</td>
            <td>{user.firstName}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{new Date(user.createAt).toLocaleDateString()}</td>
            <td>{new Date(user.lastLoginDate).toLocaleDateString()}</td>
            <td>
                <div className="dropdown dropdown-end" onClick={(e) => e.stopPropagation()}>
                    <label tabIndex={0} className=" m-1">
                        <span className="btn btn-sm">
                            <BsThreeDots className="text-lg" />
                        </span>
                    </label>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu border top-10 border-gray-700 rounded-sm shadow bg-base-100  w-40"
                    >
                        <li onClick={() => setInputRoleId({ id: user.id })}>
                            <label htmlFor='UserRoleModal' className="">
                                <span>
                                    <FiEdit className="text-success" />
                                </span>
                                <span>Role</span>
                            </label>
                        </li>
                        <li>
                            <label htmlFor="my-modal" className="">
                                <span>
                                    <MdDelete className="text-error text-lg" />
                                </span>
                                <span onClick={() => setDeleteModal(user)}>Delete</span>
                            </label>
                        </li>
                        <li>
                            <div className=" ">
                                <span>
                                    <MdDetails className=" text-white text-lg" />
                                </span>
                                <span>Details</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </td>
        </tr>
    );
};

export default PatientsTableRow;