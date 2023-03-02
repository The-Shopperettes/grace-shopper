import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { authenticate } from "../../app/store";
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

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const formName = evt.target.name;
    const username = evt.target.username.value;
    const password = evt.target.password.value;
    dispatch(authenticate({ username, password, method: formName }));
  };

  return (
    <div>
      <h2>Welcome</h2>
      <h3>We're glad you're here.</h3>
      <div id="login-form">
        <h5>Login</h5>
        <Form>
          <Form.Label>Username</Form.Label>
            <Form.Control type='text' placeholder='Enter username'/>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' placeholder='Password'/>
            <Button type='submit'>Login</Button>
        </Form>
        {/* <form onSubmit={handleSubmit} name={name}>
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
        </form> */}
      </div>
      <div id='signup-form'>
        <h6>New to Plant Shopper? Register below!</h6>
        <Form>
          <Form.Group controlId='formSignup'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control type='email' placeholder='Enter email'/>
            <Form.Label>Username</Form.Label>
            <Form.Control type='text' placeholder='Enter username'/>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' placeholder='Password'/>
            <Button type='submit'>Sign Me Up!</Button>
          </Form.Group>
        </Form>

      </div>
    </div>
  );
};

export default AuthForm;
