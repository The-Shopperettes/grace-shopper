import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import AuthForm from '../features/auth/AuthForm';
import Home from '../features/home/Home';
import Cart from '../features/cart/Cart';
import AllProducts from '../features/products/products';
import SingleProduct from '../features/products/singleProductComponent';
import CheckoutPage from '../features/order/CheckoutPage';
import User from '../features/user/User';
import { me } from './store';
import { fetchCart } from '../features/cart/cartSlice';

/**
 * COMPONENT
 */

const AppRoutes = () => {
  const isLoggedIn = useSelector((state) => !!(state.auth.me && state.auth.me.password));
  const user = useSelector((state) => state.auth.me);
 
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(me());
  }, []);

  ////===== TOOK OUT '.id' AFTER USER ON LINE 29===///
  useEffect(() => {
    if(user) {
      dispatch(fetchCart());
    }
  }, [user])

  return (
    <div>
        <Routes>
          <Route path="/*" element={<AllProducts />} />
          <Route path="/cart" element={<Cart />}/>
          <Route path='/products' element = {<AllProducts />} />
          <Route path='/products/:id' element = {<SingleProduct />} />
          <Route path='/users/:id' element = {<User/>}></Route>

          <Route path='/checkout' element={<CheckoutPage />} />
        {!isLoggedIn ?
        <>
          <Route
            path="/login"
            element={<AuthForm name="login" displayName="Login" />}
          />
          <Route
            path="/signup"
            element={<AuthForm name="signup" displayName="Sign Up" />}
          />
          </>
        : null}
        </Routes> 

    </div>
  );
};

export default AppRoutes;
