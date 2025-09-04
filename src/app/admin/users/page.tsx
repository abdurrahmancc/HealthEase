// app/admin/users/page.tsx
import UsersTable from '@/components/users/UsersTable';
import { User } from '@/types/types';
import axios from 'axios';
import { cookies } from 'next/headers';

type Props = { searchParams: { Page?: string; Size?: string; Search?: string } };

export const dynamic = 'force-dynamic'; // SSR force

const UsersPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = parseInt(params.Page || '1', 10);
  const size = parseInt(params.Size || '10', 10);
  const search = params.Search || '';

    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("accessToken");
    const accessToken = tokenCookie?.value;
    
    const res = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/Users/GetUsers`, {
        params: {  pageNumber: page,  pageSize: size,  search: search, },
        headers: {  Authorization: `Bearer ${accessToken}`,},
    });

    const data = res.data;

    return (
        <div className="w-full h-full">
            <div className="bg-base-200 p-5 h-full">
                <UsersTable
                    initialData={data.data}
                    initialPage={page}
                    initialSize={size}
                    initialSearch={search}
                />
            </div>
        </div>
    );
};

export default UsersPage;
