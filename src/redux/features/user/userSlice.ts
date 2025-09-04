import { UserDto } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAndSetUser } from "./userAPI";

interface UserState {
    user: UserDto | null;
    loading: boolean;
    refresh: boolean;
    error?: string;
}

const initialState: UserState = {
    user: null,
    loading: false,
    refresh: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setRefresh(state, action: PayloadAction<boolean>) {
            state.refresh = action.payload;
        },
        setUser(state, action: PayloadAction<UserDto | null>) {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAndSetUser.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(fetchAndSetUser.fulfilled, (state, action: PayloadAction<UserDto>) => {
                state.loading = false;
                state.user = action.payload;
                state.refresh = false;
            })
            .addCase(fetchAndSetUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message;
            });
    },
});

export const { setRefresh, setUser } = userSlice.actions;

export default userSlice.reducer;