import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCart = createAsyncThunk("cart/items", async (userId, {rejectWithValue}) => {
  const token = window.localStorage.getItem(TOKEN);
  try {
    const { data } = await axios.get(`/api/carts/${userId}`, {
      headers: {
        authorization: token,
      }
    });

    return data;
  } catch (err) {
    if(err.response.data) {
        return rejectWithValue(err.response.data);
    } else {
        return 'There was an issue with your request';
    }
  }
});

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.cartItems = action.payload;
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.error = action.error;
    });
  }
});

export const selectCart = (state) => state.cart;

export default cartSlice.reducer;
