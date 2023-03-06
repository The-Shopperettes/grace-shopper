import axios from 'axios';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';


const TOKEN = 'token';

export const fetchUsersAsync = createAsyncThunk('users/fetchAll',
async({page, perPage}) => {
    const token = window.localStorage.getItem(TOKEN);
    try {
        const headers = {headers: {
            authorization: token,
          }}
        const {data: users} = await axios.get(`api/users?page=${page}&perPage=${perPage}`, headers);
        const {data: usersCount} = await axios.get('api/users/count', headers)
        return {users, usersCount};
    } catch(err) {
        console.error(err);
    }
})

export const allUsersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        usersCount: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUsersAsync.fulfilled,(state, action) => {
            return action.payload;
        });
    },
});


export const selectUsers = (state) => state.allUsers;

export default allUsersSlice.reducer;