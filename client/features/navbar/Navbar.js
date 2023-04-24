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

  const linkStyle = {
    margin: "8px",
    textDecoration: "none", 
    color: "#2e2823"
  }

  const {cartItems} = useSelector(selectCart);

  const cartProductCount = (cartItems) => {
    let count=0;
    for (const cartItem of cartItems){
      count += cartItem.qty;
    }
    return count;
  }

  return (
    <div>
      <nav id='navbar'>
        <div id='navlinks'>
        <Link to="/products" style={linkStyle}>Home🌱</Link>
        {isLoggedIn ? (
          <>
            <Link to="/user" style={linkStyle}>Account</Link>
            {user.isAdmin && 
            <Link to="/allUsers" style={linkStyle}>Manage users</Link>}
            <button type="button" onClick={logoutAndRedirectHome}>
              Logout
            </button>
          </>

        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login/Sign Up</Link>
          </>
        )}
        <Link to="/cart">
              <Button variant="cart">
                🛒<Badge bg="secondary">{cartProductCount(cartItems)}</Badge>
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
