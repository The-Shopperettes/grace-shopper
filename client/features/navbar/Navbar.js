import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../auth/authSlice";
import { Button, Badge } from "react-bootstrap";
import { selectCart } from "../cart/cartSlice";
import Search from "../products/Search";

const Navbar = () => {
  const user = useSelector((state) => state.auth.me);
  const isLoggedIn = useSelector(
    (state) => !!(state.auth.me && state.auth.me.id)
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutAndRedirectHome = () => {
    dispatch(logout());
    navigate("/login");
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#1c1c1c ",
  };

  const { cartItems } = useSelector(selectCart);

  const cartProductCount = (cartItems) => {
    let count = 0;
    for (const cartItem of cartItems) {
      count += cartItem.qty;
    }
    return count;
  };

  return (
    <div>
      <nav id="navbar">
        <section id="logo-search">
          <img
            id="logo"
            src="logo.png"
            style={{ width: "20rem", height: "auto" }}
            onClick={() => navigate("/")}
          />
          <Search />
          <Link to="/cart">
            <Button variant="cart">
              <i
                className="fa-solid fa-cart-shopping fa-2x"
                style={{ color: "black" }}
              ></i>
              <Badge
                bg="success"
                style={{
                  transform: "translate(-0.4rem, -1.3rem)",
                  borderRadius: "100%",
                }}
              >
                {cartProductCount(cartItems)}
              </Badge>
              <span className="visually-hidden">cart items</span>
            </Button>
          </Link>
        </section>
        <div id="navlinks">
          <Link to="/products" style={linkStyle}>
            All Plants🌱
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/user" style={linkStyle}>
                Account
              </Link>
              {user.isAdmin && (
                <Link to="/allUsers" style={linkStyle}>
                  Manage users
                </Link>
              )}
              <button type="button" onClick={logoutAndRedirectHome}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle}>
                Login/Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
