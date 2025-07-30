import UsersTable from '@/components/users/UsersTable';
// import { cookies } from 'next/headers';
import { BiSearchAlt } from 'react-icons/bi';



const Users = async () => {
    // const cookieStore = await cookies();
    // const tokenCookie = cookieStore.get("accessToken");
    // const accessToken = tokenCookie?.value;

    // const user = await getUserFromToken(accessToken);
    // console.log("user", user)

    return (
        <div className="w-full h-full">
            <div className="bg-base-200 p-5 h-full">
                <UsersTable />
            </div>
        </div>
    );
};

export default Users;
