'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User } from '@/types/types';
import useDebounce from '@/hooks/useDebounce';
import Pagination from '../Pagination';
import { BiSearchAlt } from 'react-icons/bi';
import { toast } from 'react-toastify';
import axios from 'axios';
import UsersTableRow from './UsersTableRow';
import UserRoleModal from './UserRoleModal';
import Loading from '@/shared/Loading';

interface RoleId {
  id?: string;
}

interface Props {
  initialData: {
    items: User[];
    totalItems: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    startPage: number;
    endPage: number;
  };
  initialPage: number;
  initialSize: number;
  initialSearch: string;
}

const UsersTable = ({ initialData, initialPage, initialSize, initialSearch }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deleteModal, setDeleteModal] = useState<string | User | null>(null);
  const [inputRoleId, setInputRoleId] = useState<RoleId>({});
  const pageFromUrl = parseInt(searchParams.get('Page') || '1', 10);
  const sizeFromUrl = parseInt(searchParams.get('Size') || '10', 10);
  const searchFromUrl = searchParams.get('Search') || '';
  const [refetchFlag, setRefetchFlag] = useState(false);
  const [users, setUsers] = useState<User[]>(initialData.items);
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialSize);
  const [search, setSearch] = useState(initialSearch);
  const [totalItems, setTotalItems] = useState(initialData.totalItems);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [startPage, setStartPage] = useState(initialData.startPage);
  const [endPage, setEndPage] = useState(initialData.endPage);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/Users/GetUsers?pageNumber=${pageFromUrl}&pageSize=${sizeFromUrl}&search=${searchFromUrl}`, {
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

    const newUrl = `/admin/users?${params.toString()}`;
    if (newUrl !== window.location.pathname + window.location.search) {
      router.push(newUrl);
    }
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
        loading ?  (
        <Loading modal={false} size={5} screenHeight={80} />
      ) :

        totalItems > 0 ?
          <div>
            <div className="pt-6">
              <div className="overflow-x-auto w-full  h-[calc(100vh-250px)] overflow-y-auto">
                <table className="table w-full rounded-[10px] border-[1px] border-[rgba(255,255,255,0.05)]">
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
                      <UsersTableRow key={user.id} user={user} index={index} setDeleteModal={setDeleteModal} setInputRoleId={setInputRoleId} />
                    ))}
                  </tbody>
                </table>
                {
                  inputRoleId?.id &&
                  <UserRoleModal inputRoleId={inputRoleId} refetch={()=>setRefetchFlag(prev => !prev)} />
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

export default UsersTable;
