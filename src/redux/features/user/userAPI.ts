import { UserDto } from "@/types/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch user data
export const fetchAndSetUser = createAsyncThunk<UserDto>(
  'user/fetchAndSetUser',
  async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_baseURL}/v1/api/Users/GetLoginUser`, {
      credentials: 'include',
    });
    const data = await res.json();
    return data.data as UserDto;
  }
);