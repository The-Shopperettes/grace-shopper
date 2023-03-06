import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { authenticateLogin, authenticateSignUp } from "../../app/store";
import { useNavigate } from "react-router";
import {Form, Button} from 'react-bootstrap'

/**
  The AuthForm component can be used for Login or Sign Up.
  Props for Login: name="login", displayName="Login"
  Props for Sign up: name="signup", displayName="Sign Up"
**/

// ------------- using for login ------------------- //

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
    dispatch(authenticateSignUp({email, username, password, method: formName}));
    // may need another authenticate function so that we can also pass the email??

    // need to call the auth/signup route
    
    //need to make error message if user already exists
  };

  return (
    <div>
      <h2>Welcome</h2>
      <h3>We're glad you're here.</h3>
      <div id="login-form">
        <h5>Login</h5>
        {/* <Form onSubmit={handleSubmit}>
          <Form.Label>Username</Form.Label>
            <Form.Control type='text' placeholder='Enter username'/>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' placeholder='Password'/>
            <Button type='submit'>Login</Button>
        </Form> */}
        <form onSubmit={handleSubmit} name='login'>
          <div>
            <label htmlFor="username">
              <small>Username</small>
            </label>
            <input name="username" type="text" />
          </div>
          <div>
            <label htmlFor="password">
              <small>Password</small>
            </label>
            <input name="password" type="password" />
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
          {error && <div> {error} </div>}
        </form>
      </div>
      <div id='signup-form'>
        <h6>New to Plant Shopper? Register below!</h6>
        <form onSubmit={handleNewUser} name='signup'>
        <div>
            <label htmlFor="email">
              <small>Email</small>
            </label>
            <input name="email" type="email" />
          </div>
          <div>
            <label htmlFor="username">
              <small>Username</small>
            </label>
            <input name="username" type="text" />
          </div>
          <div>
            <label htmlFor="password">
              <small>Password</small>
            </label>
            <input name="password" type="password" />
          </div>
          <div>
            <button type="submit">Sign Me Up!</button>
          </div>
          {error && <div> {error} </div>}
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
