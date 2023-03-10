import axios from 'axios';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

// TODO: fetch the count of the product too & add to slice

export const fetchProductsAsync = createAsyncThunk('products/fetchAll',
async({page, perPage}) => {
    try {
        const {data} = await axios.get(`api/products?page=${page}&perPage=${perPage}`);
        const count = await axios.get('api/products/count')
        return {products: data, productCount: count.data};
    } catch(err) {
        console.error(err);
    }
})


export const productsSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        productCount: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProductsAsync.fulfilled,(state, action) => {
            return action.payload;
        });
    },
});


export const selectProducts = (state) => state.products;

export default productsSlice.reducer;