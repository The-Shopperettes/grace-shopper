import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk('user', async (id) => {
    try {
    const {data} = await axios.get(`/api/users/${id}`);
    return data;
    } catch (error) {
        console.error(error)
    }
});

export const userSlice = createSlice({
    name: "user",
    initialState: {},
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            return action.payload;
        })
    }
});

export const selectUser = (state) => state.user;

export default userSlice.reducer;