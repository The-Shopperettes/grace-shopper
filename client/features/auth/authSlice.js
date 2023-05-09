import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/*
  CONSTANT VARIABLES
*/
const TOKEN = "token";

/*
  THUNKS
*/
export const me = createAsyncThunk("auth/me", async (_, { getState }) => {
  const currentCart = getState().cart;
  try {
    const token = window.localStorage.getItem(TOKEN);
    if (token) {
      const { data } = await axios.get("/auth/me", {
        headers: {
          authorization: token,
        },
      });

      if (currentCart.cartItems.length) {
        await axios.put(
          "/api/carts/transfer",
          {},
          {
            headers: {
              authorization: token,
            },
          }
        );
      }
      return data;
    } else {
      const res = await axios.get("/api/visitors");
      return res.data;
    }
  } catch (err) {
    const res = await axios.get("/api/visitors");
    return res.data;
  }
});

export const authenticateLogin = createAsyncThunk(
  "auth/authenticateLogin",
  async ({ username, password }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post(`/auth/login`, { username, password });
      if (!res.data.token) return rejectWithValue("Unauthorized");
      window.localStorage.setItem(TOKEN, res.data.token);
      dispatch(me());
    } catch (err) {
      return rejectWithValue("Unauthorized");
    }
  }
);

export const authenticateSignUp = createAsyncThunk(
  "auth/authenticateSignUp",
  async ({ email, username, password }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post(`/auth/signup`, {
        email,
        username,
        password,
      });
      if (!res.data.token) throw new Error();
      window.localStorage.setItem(TOKEN, res.data.token);
      dispatch(me());
    } catch (err) {
      return rejectWithValue("Unauthorized");
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  window.localStorage.removeItem(TOKEN);
  try {
    const res = await axios.get("/api/visitors");

    return res.data;
  } catch (err) {
    console.error(err);
  }
});

/*
  SLICE
*/
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    me: {},
    error: null,
  },
  reducers: {
    resetAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(me.fulfilled, (state, action) => {
      state.me = action.payload;
    });
    builder.addCase(me.rejected, (state, action) => {
      state.error = action.error;
    });
    builder.addCase(authenticateLogin.rejected, (state, action) => {
      state.error = action.payload;
    });
    builder.addCase(authenticateSignUp.rejected, (state, action) => {
      state.error = action.payload;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.me = action.payload;
      state.error = null;
    });
  },
});

/*
  REDUCER
*/
export default authSlice.reducer;
export const { resetAuthError } = authSlice.actions;
