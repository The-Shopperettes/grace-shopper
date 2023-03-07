import axios from "axios";
import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// TODO: fetch the count of the product too & add to slice

export const fetchProductsAsync = createAsyncThunk(
  "products/fetchAll",
  async ( { page, perPage, cycleFilter, waterFilter, sort, search } ) => {
    try {
      let query = "";
      if (cycleFilter) {
        query += `&cycleFilter=${cycleFilter}`;
      }
      if (waterFilter) {
        query += `&waterFilter=${waterFilter}`;
      }
      if (sort) {
        query += `&sort=${sort}`;
      }
      if (search) {
        query += `&search=${search}`;
      }
      const { data } = await axios.get(
        `/api/products?page=${page}&perPage=${perPage}${query}`
      );
      const count = await axios.get("api/products/count");
      return { products: data, productCount: count.data };
    } catch (err) {
      console.error(err);
    }
  }
);

export const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    productCount: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const selectProducts = (state) => state.products;

export default productsSlice.reducer;
