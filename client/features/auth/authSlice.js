import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/*
  CONSTANT VARIABLES
*/
const TOKEN = "token";

/*
  THUNKS
*/
export const me = createAsyncThunk('auth/me', async (_, {getState}) => {
  const currentCart = getState().cart;
  try {
    const token = window.localStorage.getItem(TOKEN);
    if (token) {
      const {data} = await axios.get('/auth/me', {
        headers: {
          authorization: token,
        },
      });

      if(currentCart.cartItems.length) {
        await axios.put('/api/carts/transfer', {},{
          headers: {
            authorization: token,
          },
        })
      }
      return data;
    }
    else {
      const res = await axios.get('/api/visitors');
      return res.data;
    }
  } catch (err) {
    console.error(err);
    const res = await axios.get('/api/visitors');
    return res.data;
  }

});

export const authenticateLogin = createAsyncThunk(
  "auth/authenticateLogin",
  async ({ username, password, method }, thunkAPI) => {
    try {
      const res = await axios.post(`/auth/${method}`, { username, password });
      window.localStorage.setItem(TOKEN, res.data.token);
      thunkAPI.dispatch(me());
    } catch (err) {
      if (err.response.data) {
        return thunkAPI.rejectWithValue(err.response.data);
      } else {
        return "There was an issue with your request.";
      }
    }
  }
);

export const authenticateSignUp = createAsyncThunk("auth/authenticateSignUp", 
async ({email, username, password, method}, thunkAPI) => {
  try {
    const res = await axios.post(`/auth/${method}`, { email, username, password });
      window.localStorage.setItem(TOKEN, res.data.token);
      thunkAPI.dispatch(me());
  } catch (err) {
    if (err.response.data) {
      return thunkAPI.rejectWithValue(err.response.data);
    } else {
      return "There was an issue with your request.";
    }
  }
})

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    window.localStorage.removeItem(TOKEN);
    try {
      const res = await axios.get('/api/visitors');

      return res.data;
    } catch (err) {
      console.error(err);
    }
  }
)

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
    })
  },
});

/*
  REDUCER
*/
export default authSlice.reducer;
