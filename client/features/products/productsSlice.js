import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// TODO: fetch the count of the product too & add to slice

export const fetchProductsAsync = createAsyncThunk(
  "products/fetchAll",
  async ({ page, perPage, search, selections, sort }, { rejectWithValue }) => {
    try {
      const {
        data: { products, count, cycle, sunlight, watering },
      } = await axios.put(
        `api/products?page=${page}&perPage=${perPage}&search=${search}`,
        { selections, sort }
      );
      if (!products.length) return rejectWithValue("No products found");

      return {
        products,
        productCount: count,
        filters: [cycle, sunlight, watering],
        error: null,
      };
    } catch (err) {
      console.error(err);
    }
  }
);

const initialState = {
  products: [],
  productCount: null,
  filters: [],
  error: null,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProducts() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(fetchProductsAsync.rejected, (state, action) => {
      state.error = action.payload;
      state.products = 0;
      state.productCount = 0;
    });
  },
});

export const selectProducts = (state) => state.products;

export default productsSlice.reducer;
export const { resetProducts } = productsSlice.actions;
