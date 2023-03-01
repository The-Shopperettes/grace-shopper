import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import userReducer from '../features/user/userSlice';
import productsReducer from '../features/products/productsSlice';
import singleProductReducer from '../features/products/singleProductSlice';

const store = configureStore({
  reducer: { 
    auth: authReducer,
    cart: cartReducer,
    user: userReducer,
    products: productsReducer,
    singleProduct: singleProductReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
export * from '../features/auth/authSlice';
