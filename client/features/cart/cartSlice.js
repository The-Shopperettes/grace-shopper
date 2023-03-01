import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const TOKEN = 'token';

export const fetchCart = createAsyncThunk("cart/items", async (userId, {rejectWithValue}) => {
  const token = window.localStorage.getItem(TOKEN);
  try {
    const { data } = await axios.get(`/api/carts/${userId}`, {
      headers: {
        authorization: token,
      }
    });

    return data.cartItems;
  } catch (err) {
    console.error(err);
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
