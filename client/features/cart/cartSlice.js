import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const TOKEN = 'token';

export const fetchCart = createAsyncThunk("cart/items", async (_, {dispatch}) => {
  const token = window.localStorage.getItem(TOKEN);
  try {
    const { data: {id, cartItems} } = await axios.get(`/api/carts`, {
      headers: {
        authorization: token,
      }
    });

    return {cartId: id, cartItems, error: null};
  } catch (err) {
    console.error(err);
  }
});

export const updateQty = createAsyncThunk("cart/updateItem", async ({itemId, qty, cartId}, {dispatch}) => {
  const token = window.localStorage.getItem(TOKEN);

  try {

    await axios.put(`/api/carts/item/${itemId}`, {qty, cartId}, {headers: {
      authorization: token,
    }});

    dispatch(fetchCart());

  } catch (err) {
    console.error(err);
  }
})

export const deleteItem = createAsyncThunk("cart/deleteItem", async(itemId, {dispatch}) => {
  const token = window.localStorage.getItem(TOKEN);
  try {
    await axios.delete(`/api/carts/item/${itemId}`, {headers: {
      authorization: token,
    }}, {itemId});

    dispatch(fetchCart());

  } catch (err) {
    console.error(err);
  }
})

export const addToCart = createAsyncThunk("cart/addItem", async({productId, qty}, {dispatch}) => {
  const token = window.localStorage.getItem(TOKEN);
  try {
    await axios.post(`/api/carts/item/add`, {productId, qty}, {headers: {
      authorization: token,
    }});

    dispatch(fetchCart());

  } catch (err) {
    console.error(err);
  }
})

export const order = createAsyncThunk("cart/order", async (email, {dispatch}) => {
  const token = window.localStorage.getItem(TOKEN);
  try {
    const body = email ? {email} : {email: null};
    await axios.put(`/api/carts/order`, body, {headers: {
      authorization: token,
    }});

    dispatch(fetchCart());

  } catch (err) {
    console.error(err);
    return err.message;
  }
})

export const clearCart = createAsyncThunk("cart/clear", async(_, {dispatch}) => {
  const token = window.localStorage.getItem(TOKEN);
  try {
    await axios.put(`/api/carts/clear`, {}, {
      headers: {
        authorization: token,
      }
    });

    dispatch(fetchCart());
  } catch (err) {
    console.error(err);
  }
})

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
    builder.addCase(updateQty.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
  });
    builder.addCase(order.fulfilled, (state, action) => {
      if(typeof action.payload === 'string') state.error = action.payload;
    })
}});

export const selectCart = (state) => state.cart;

export default cartSlice.reducer;
