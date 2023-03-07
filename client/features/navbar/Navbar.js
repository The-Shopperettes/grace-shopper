import React, {useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../auth/authSlice";
import { Button, Badge } from "react-bootstrap";
import { selectCart } from '../cart/cartSlice';

const Navbar = () => {
  const user = useSelector(state => state.auth.me);
  const isLoggedIn = !!user.password;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutAndRedirectHome = () => {
    dispatch(logout());
    navigate("/login");
  };

  const {cartItems} = useSelector(selectCart);

  return (
    <div>
      <nav id='navbar'>
        <div id='navlinks'>
        <Link to="/products">Home🌱</Link>
        {isLoggedIn ? (
          <>
            <button type="button" onClick={logoutAndRedirectHome}>
              Logout
            </button>
            <Link to="/user">Account</Link>
            {user.isAdmin && 
            <Link to="/allUsers">Manage users</Link>}
          </>

        ) : (
          <>
            <Link to="/login">Login/Sign Up</Link>
          </>
        )}
        <Link to="/cart">
              <Button variant="cart">
                🛒<Badge bg="secondary">{cartItems.length}</Badge>
                <span className="visually-hidden">cart items</span>
              </Button>
            </Link>
        </div>
      <img id='logo' src="logo.png"></img>
      </nav>
    </div>
  );
};

export default Navbar;
