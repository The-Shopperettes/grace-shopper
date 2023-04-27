import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  authenticateLogin,
  authenticateSignUp,
  resetAuthError,
} from "../../app/store";
import { useNavigate, useParams } from "react-router";
import { Container, InputGroup, Form, Button } from "react-bootstrap";
import AuthTemplate from "./AuthTemplate";

//Login or signup form (type = login or signup)
const AuthForm = ({ type }) => {
  const { error: authError } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError("");
    dispatch(resetAuthError());
    document.querySelector(".user-form").reset();
  }, [type]);

  useEffect(() => {
    console.log("auth error: ", authError);
    if (loading && authError) {
      setError("An error occurred.");
      setLoading(false);
      dispatch(resetAuthError());
    }
  }, [authError]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    const [username, password] = [e.target.username, e.target.password].map(
      ({ value }) => value
    );

    dispatch(authenticateLogin({ username, password }));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setLoading(true);
    const [username, email, password] = [
      e.target.username,
      e.target.email,
      e.target.password,
    ].map(({ value }) => value);

    dispatch(authenticateSignUp({ email, username, password }));
  };

  const loginInputs = [
    { aria: "login username input", placeholder: "Username", name: "username" },
    {
      aria: "login password input",
      placeholder: "password",
      name: "password",
      type: "password",
    },
  ];

  const signupInputs = [
    {
      aria: "new user email input",
      placeholder: "Email",
      name: "email",
      type: "email",
    },
    {
      aria: "new user username input",
      placeholder: "Username",
      name: "username",
    },
    {
      aria: "new user password input",
      placeholder: "password",
      name: "password",
      type: "password",
    },
  ];

  return (
    <Container fluid>
      <Container id="login-or-signup">
        {type === "login" ? (
          <AuthTemplate
            inputs={loginInputs}
            error={error}
            header="Login"
            buttonLabel="Submit"
            onSubmit={handleLogin}
            disabled={loading}
          />
        ) : (
          <AuthTemplate
            inputs={signupInputs}
            error={error}
            header="Sign up"
            buttonLabel="Create account"
            onSubmit={handleSignup}
            disabled={loading}
          />
        )}
      </Container>
    </Container>
  );
};

export default AuthForm;
