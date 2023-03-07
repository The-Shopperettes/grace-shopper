import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {};
const TOKEN = 'token';

export const fetchSingleProduct = createAsyncThunk("singleProduct", async (id) => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      return data;
    } catch (err) {
      console.error(err);
    }
  });

  export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async (id) => {
      const token = window.localStorage.getItem(TOKEN);
      try {
      const { data } = await axios.delete(
        `/api/products/${id}`, {headers: {
          authorization: token,
        }});
      return data;
    } catch (err) {
      console.log(err);
    }
  });

  export const editProduct = createAsyncThunk(
    "products/editProduct",
    async (update) => {
      const {id, ...body} = update; 
      const token = window.localStorage.getItem(TOKEN);
      try {
      const { data } = await axios.put(`/api/products/${id}`, body, {headers: {
        authorization: token,
      }});
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
      builder.addCase(editProduct.fulfilled, (state, action) => {
        return action.payload;
      });
    },
  });
  
  export const selectSingleProduct = (state) => {
    return state.singleProduct;
  };
  export default singleProductSlice.reducer;