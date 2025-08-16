"use client"
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { User } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { BiSearchAlt } from "react-icons/bi";
import { SubmitHandler, useForm } from "react-hook-form";
import useDebounce from "@/hooks/useDebounce";
import Pagination from "../../Pagination";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from 'next/navigation';
import DoctorsTableRow from "./DoctorsTableRow";
import UserRoleModal from "../../users/UserRoleModal";

interface RoleId {
  id?: string;
}

interface SearchFormInputs {
  search: string;
}


const DoctorsTable = () => {
      const router = useRouter();
  const searchParams = useSearchParams();
  const [deleteModal, setDeleteModal] = useState<string | User | null>(null);
  const [inputRoleId, setInputRoleId] = useState<RoleId>({});
  const pageFromUrl = parseInt(searchParams.get('Page') || '1', 10);
  const sizeFromUrl = parseInt(searchParams.get('Size') || '10', 10);
  const searchFromUrl = searchParams.get('Search') || '';
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [endPage, setEndPage] = useState(0);
  const [startPage, setStartPage] = useState(0);
  const [search, setSearch] = useState(searchFromUrl);
  const debouncedSearch = useDebounce(search, 500);
  const [pageNumber, setPageNumber] = useState(pageFromUrl);
  const [rowsPerPage, setRowsPerPage] = useState(sizeFromUrl);
    const [refetchFlag, setRefetchFlag] = useState(false);


  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/Users/GetUsers?pageNumber=${pageFromUrl}&pageSize=${sizeFromUrl}&search=${searchFromUrl}&role=Doctor`, {
          withCredentials: true,
        });
        setUsers(res.data?.data?.items || []);
        setTotalItems(res.data?.data?.totalItems);
        setTotalPages(res.data?.data?.totalPages);
        setEndPage(res.data?.data?.endPage);
        setStartPage(res.data?.data?.startPage);
        setPageNumber(res.data?.data?.pageNumber);
        setRowsPerPage(res.data?.data?.pageSize);
        setSearch(searchFromUrl);
      } catch (err: any) {
        toast.error(err.message || 'Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchParams.toString(), refetchFlag]);


  useEffect(() => {
    updateUrl(pageNumber, rowsPerPage, debouncedSearch);
  }, [debouncedSearch]);

  const updateUrl = (page: number, size: number, searchText: string) => {
    const params = new URLSearchParams();
    params.set('Page', page.toString());
    params.set('Size', size.toString());
    if (searchText) params.set('Search', searchText);

    const newUrl = `/admin/doctors?${params.toString()}`;
    if (newUrl !== window.location.pathname + window.location.search) {
      router.push(newUrl);
    }
  };

  const handleRefetch = () => {
    updateUrl(pageNumber, rowsPerPage, search);
  };

const updatePagination = (page: number, size: number, searchText: string) => {
  const params = new URLSearchParams();
  params.set('Page', page.toString());
  params.set('Size', size.toString());
  if (searchText) params.set('Search', searchText);

  const newUrl = `/admin/users?${params.toString()}`;
  if (newUrl !== window.location.pathname + window.location.search) {
    router.push(newUrl);
  }
};
    return (
    <>
      <div className="flex justify-between">
        <div>
          <form onSubmit={(e) => e.preventDefault()}>
            <label className={`relative w-[250px]  md:block max-w-xs hidden `} >
              <button type="submit" className="absolute inset-y-0 right-2 rounded pr-1  flex items-center pl-2" >
                <BiSearchAlt className="text-2xl text-gray-400" />
              </button>
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPageNumber(1);
                }}
                className="placeholder:italic placeholder:text-slate-400 block bg-base-100 w-full  py-2 pl-6  pr-9 shadow-sm focus:outline-none focus:border-0 rounded-full  focus:ring-0 sm:text-sm"
                placeholder="Search..."
                type="text"
                name="search"
              />
            </label>
          </form>
        </div>
      </div>
      {
        totalItems > 0 ?
          <div>
            <div className="pt-6">
              <div className="overflow-x-auto w-full h-full">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joining Date</th>
                      <th>Last Joined</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="cursor-pointer">
                    {users?.length > 0 && users.map((user: User, index: number) => (
                      <DoctorsTableRow key={user.id} user={user} index={index} setDeleteModal={setDeleteModal} setInputRoleId={setInputRoleId} />
                    ))}
                  </tbody>
                </table>
                {
                  inputRoleId?.id &&
                  <UserRoleModal inputRoleId={inputRoleId} refetch={()=>setRefetchFlag(prev=> !prev)} />
                }
              </div>
            </div>
            <Pagination
              pageNumber={pageNumber}
              rowsPerPage={rowsPerPage}
              totalItems={totalItems}
              totalPages={totalPages}
              endPage={endPage}
              startPage={startPage}
              onPageChange={(newPage) => {setPageNumber(newPage); updatePagination(newPage, rowsPerPage, search)}}
              onRowsPerPageChange={(newRows) => { setRowsPerPage(newRows);  setPageNumber(1); updatePagination(1, newRows, search) }}
            />
          </div>
          :
          <div className="flex justify-center items-center h-full ">Not Fount Users</div>
      }

    </>
    );
};

export default DoctorsTable;