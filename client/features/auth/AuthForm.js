import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { authenticateLogin, authenticateSignUp } from "../../app/store";
import { useNavigate } from "react-router";
import { Container } from "react-bootstrap";

const AuthForm = ({ name, displayName }) => {
  const { error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const formName = evt.target.name;
    const username = evt.target.username.value;
    const password = evt.target.password.value;
    dispatch(authenticateLogin({ username, password, method: formName }));
  };

  const handleNewUser = (evt) => {
    evt.preventDefault();
    const formName = evt.target.name;
    const username = evt.target.username.value;
    const email = evt.target.email.value;
    const password = evt.target.password.value;
    dispatch(
      authenticateSignUp({ email, username, password, method: formName })
    );
  };

  return (
    <div>
      <div id="login-or-signup">
        <h2 id="welcome">Welcome</h2>
        <h3 id="wel-subtitle">We're glad you're here.</h3>
        <div id="login-form">
          <h6 id="login-header">Login</h6>
          <form id="login-flex" onSubmit={handleSubmit} name="login">
            <div>
              <label htmlFor="username"></label>
              <input name="username" type="text" placeholder="Username" />
            </div>
            <div>
              <label htmlFor="password"></label>
              <input name="password" type="password" placeholder="Password" />
            </div>
            <div>
              <button type="submit">Login</button>
            </div>
            {error ? (
              <div>
                {" "}
                {typeof error === "string" ? error : "An error occurred"}{" "}
              </div>
            ) : null}
          </form>
        </div>
        <div id="signup-form">
          <h6>New to Plant Shopper? Register below!</h6>
          <form id="signup-flex" onSubmit={handleNewUser} name="signup">
            <div className="signup-div">
              <label htmlFor="email"></label>
              <input name="email" type="email" placeholder="Email" />
            </div>
            <div className="signup-div">
              <label htmlFor="username"></label>
              <input name="username" type="text" placeholder="Username" />
            </div>
            <div className="signup-div">
              <label htmlFor="password"></label>
              <input name="password" type="password" placeholder="Password" />
            </div>
            <div className="signup-div">
              <button type="submit">Sign Me Up!</button>
            </div>
            {error ? (
              <div>
                {" "}
                {typeof error === "string" ? error : "An error occurred"}{" "}
              </div>
            ) : null}
          </form>
        </div>
      </div>
      <div>
        <footer className="foot" />
      </div>
    </div>
  );
};

export default AuthForm;
