import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../app/store";
import { Button, Badge } from "react-bootstrap";

const Navbar = () => {
  const isLoggedIn = useSelector((state) => !!state.auth.me);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutAndRedirectHome = () => {
    dispatch(logout());
    navigate("/products");
  };

  return (
    <div>
      <h1>FS-App-Template</h1>
      <nav>
        {isLoggedIn ? (
          <div>
            {/* The navbar will show these links after you log in */}
            <Link to="/products">Home</Link>
            <button type="button" onClick={logoutAndRedirectHome}>
              Logout
            </button>
            <Link to="/cart">
              <Button variant="cart">
                🛒<Badge bg="secondary">0</Badge>
                <span className="visually-hidden">cart items</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div>
            {/* The navbar will show these links before you log in */}
            <Link to="/products">Home🌱</Link>
            <Link to="/login">Login/Sign Up</Link>
            <Link to="/cart">
              <Button variant="cart">
                🛒<Badge bg="secondary">0</Badge>
                <span className="visually-hidden">cart items</span>
              </Button>
            </Link>
          </div>
        )}
      </nav>
      <hr />
    </div>
  );
};

export default Navbar;
