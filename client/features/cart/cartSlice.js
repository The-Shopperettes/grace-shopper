import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const TOKEN = 'token';

export const fetchCart = createAsyncThunk("cart/items", async () => {
  const token = window.localStorage.getItem(TOKEN);
  try {
    const { data: {id, cartItems} } = await axios.get(`/api/carts`, {
      headers: {
        authorization: token,
      }
    });
    console.log(id, cartItems);
    return {cartId: id, cartItems, error: null};
  } catch (err) {
    console.error(err);
  }
});

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartId: null,
    cartItems: [],
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.error = action.error;
    });
  }
});

export const selectCart = (state) => state.cart;

export default cartSlice.reducer;
