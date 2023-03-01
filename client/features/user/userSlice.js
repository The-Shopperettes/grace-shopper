import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk('user', async (id) => {
    try {
    const {data} = await axios.get(`/api/${id}`)
    } catch (error) {
        console.log(error)
    }
});

export const userSlice = createSlice({
    name: "user",
    initialState: {},
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state = action.payload;
        })
    }
});

export const selectUser = (state) => state.user;

export default userSlice.reducer;