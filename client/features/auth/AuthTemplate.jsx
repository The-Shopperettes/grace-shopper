import React from "react";
import { InputGroup, Form, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const AuthTemplate = ({
  inputs,
  error,
  header,
  buttonLabel,
  disabled,
  onSubmit,
}) => {
  return (
    <Form onSubmit={onSubmit} className="user-form">
      <h3 className="user-header">{header}</h3>
      {header === "Login" ? (
        <p>
          Don't have an account yet?{" "}
          <Link to="/signup">Click here to sign up!</Link>
        </p>
      ) : (
        <p>
          Already have an account?{" "}
          <Link to="/login">Click here to log in!</Link>
        </p>
      )}
      <Container className="user-flex">
        {inputs.map(({ aria, placeholder, name, type }, i) => (
          <InputGroup key={i}>
            <Form.Control
              aria-label={aria}
              placeholder={placeholder}
              name={name}
              type={type || "text"}
              required
            />
          </InputGroup>
        ))}
        <Button type="submit" disabled={disabled} variant="secondary">
          {disabled ? "Loading..." : buttonLabel}
        </Button>
        {error ? <div> {error} </div> : null}
      </Container>
    </Form>
  );
};

export default AuthTemplate;
