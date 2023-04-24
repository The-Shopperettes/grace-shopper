import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// TODO: fetch the count of the product too & add to slice

export const fetchProductsAsync = createAsyncThunk(
  "products/fetchAll",
  async ({ page, perPage, search }) => {
    try {
      const {
        data: { products, count, cycle, sunlight, watering },
      } = await axios.put(
        `api/products?page=${page}&perPage=${perPage}&search=${search}`,
        { body: "hello" }
      );
      return {
        products,
        productCount: count,
        filters: [cycle, sunlight, watering],
      };
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
    filters: [],
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
