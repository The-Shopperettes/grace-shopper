import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {};

export const fetchSingleProduct = createAsyncThunk("singleProduct", async (id) => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      return data;
    } catch (err) {
      console.log(err);
    }
  });

  export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async (id) => {
      try {
      const { data } = await axios.delete(
        `/api/products/${id}`);
      return data;
    } catch (err) {
      console.log(err);
    }
  });
  
  const singleProductSlice = createSlice({
    name: "singleProduct",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(fetchSingleProduct.fulfilled, (state, action) => {
        return action.payload;
      });
      builder.addCase(deleteProduct.fulfilled, (state, action) => {
        return {};
      });
    },
  });
  
  export const selectSingleProduct = (state) => {
    return state.singleProduct;
  };
  export default singleProductSlice.reducer;