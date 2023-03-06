import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const TOKEN = 'token';

export const fetchUser = createAsyncThunk('user', async () => {
    const token = window.localStorage.getItem(TOKEN);
    try {
    const {data} = await axios.get(`/api/users/token`, {headers: {
        authorization: token,
      }});
    return data;

    } catch (error) {
        console.error(error)
    }
});

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: {},
        orders: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            return action.payload;
        })
    }
});

export const selectUser = (state) => state.user;

export default userSlice.reducer;