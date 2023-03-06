import React from "react";
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
      <h1>Wild Roots</h1>
      <nav id='navbar'>
        <Link to="/products">Home🌱</Link>
        <div id='navlinks'>
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
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
        <Link to="/cart">
              <Button variant="cart">
                🛒<Badge bg="secondary">{cartItems.length}</Badge>
                <span className="visually-hidden">cart items</span>
              </Button>
            </Link>
        </div>
      <img src="logo.png"></img>
      </nav>
    </div>
  );
};

export default Navbar;
