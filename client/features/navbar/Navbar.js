import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../auth/authSlice";
import { Button, Badge } from "react-bootstrap";
import { selectCart } from '../cart/cartSlice';

const Navbar = () => {
  const isLoggedIn = useSelector((state) => !!state.auth.me.password);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutAndRedirectHome = () => {
    dispatch(logout());
    // Need to edit this navigation route so it shows login/signup options when it redirects to home page
    navigate("/login");
  };

  const {cartItems} = useSelector(selectCart);

  return (
    <div>
      <h1>Wild Roots</h1>
      <nav>
        <Link to="/products">Home🌱</Link>
        {isLoggedIn ? (
          <>
            <button type="button" onClick={logoutAndRedirectHome}>
              Logout
            </button>
            <Link to="/user">Account</Link>
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
      </nav>
      <hr />
    </div>
  );
};

export default Navbar;
