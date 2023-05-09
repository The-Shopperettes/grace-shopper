import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCart, fetchCart, order } from "../cart/cartSlice";
import {
  Accordion,
  Form,
  Container,
  Row,
  Col,
  Button,
  Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import PaymentForm from "./PaymentForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const PUBLISHABLE_KEY =
  "pk_test_51MiLhrLln7p5YtECXlXKOV96PLFeJJODhaJDVS6BDy060PbpOXXz6NeFDUm1MyEl3XpnQQ4Ei0a0V8yPGSo9f6LO002aPDefM3";

const CheckoutPage = () => {
  const [active, setActive] = useState(8);
  const [loading, setLoading] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [price, setPrice] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const [clientSecret, setClientSecret] = useState("");
  const [stripePromise, setStripePromise] = useState(() =>
    loadStripe(PUBLISHABLE_KEY)
  );

  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.auth);
  const { cartItems } = useSelector(selectCart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (!cartItems || !cartItems.length) return;
    getSecret();
  }, [cartItems]);

  async function getSecret() {
    try {
      const { data } = await axios.post("/api/payments/create-payment-intent", {
        cartItems,
      });

      setClientSecret(data.clientSecret);
    } catch (err) {
      console.error(err);
    }
  }

  const appearance = {
    theme: "stripe",
  };
  const options = { clientSecret, appearance };

  useEffect(() => {
    //if it's a user, start active at event key 1, else 0
    setActive(me && me.username ? 1 : 0);
  }, [me]);

  useEffect(() => {
    if (cartItems && cartItems.length) {
      setPrice(
        cartItems.reduce(
          (sum, { product: { price }, qty }) => sum + price * qty,
          0
        )
      );
    }
  }, [cartItems]);

  useEffect(() => {
    if (loading) {
      if (cartItems.length === 0) {
        setConfirmed(true);
        console.log("confirming!");
      } else {
        setOrderError(
          "There was an issue with your order. Please try again later."
        );
      }
    }
  }, [loading, cartItems]);

  function testEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  function placeOrder() {
    setLoading(true);
    dispatch(order(testEmail(guestEmail) ? guestEmail : null));
  }

  const Confirmation = () => (
    <Container>
      <Row>
        <h1>Thank you for your order!</h1>
      </Row>
      <Row>
        <Link to="/products">Click here to keep browsing our plants</Link>
      </Row>
    </Container>
  );

  //if there are no items in the cart, tell user to go to home
  return (
    <>
      {confirmed ? (
        <Confirmation />
      ) : (
        <>
          {cartItems && cartItems.length ? (
            <Container>
              <Row>
                <Col md={6} sm="auto">
                  <Accordion activeKey={[active.toString()]}>
                    <h1>Checkout</h1>
                    {!me || !me.username ? (
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>Account details</Accordion.Header>
                        <Accordion.Body>
                          <Form>
                            <span
                              style={{
                                display: "flex",
                                marginBottom: "0.5rem",
                              }}
                            >
                              <Button
                                style={{
                                  height: "2rem",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "fit-content",
                                  marginRight: "0.5rem",
                                }}
                              >
                                <Link
                                  to="/login"
                                  style={{
                                    textDecoration: "none",
                                    color: "white",
                                  }}
                                >
                                  Log in
                                </Link>
                              </Button>{" "}
                              <Button
                                style={{
                                  height: "2rem",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "fit-content",
                                }}
                              >
                                <Link
                                  to="/signup"
                                  style={{
                                    textDecoration: "none",
                                    color: "white",
                                  }}
                                >
                                  Create an account
                                </Link>
                              </Button>
                            </span>
                            <Form.Group
                              style={{ width: "25rem", marginRight: "0.5rem" }}
                              className="mb-3"
                            >
                              <Form.Label>
                                Enter email address to checkout as guest
                              </Form.Label>
                              <Form.Control
                                type="email"
                                placeholder="Enter email"
                                required
                                onChange={(e) => setGuestEmail(e.target.value)}
                                style={{ maxWidth: "80vw" }}
                              />
                              <Form.Text className="text-muted">
                                {!guestEmail.length || testEmail(guestEmail)
                                  ? ""
                                  : "Please enter a valid email"}
                              </Form.Text>
                            </Form.Group>
                            <Button
                              disabled={!testEmail(guestEmail)}
                              onClick={() => setActive(1)}
                            >
                              Next
                            </Button>
                          </Form>
                        </Accordion.Body>
                      </Accordion.Item>
                    ) : null}

                    <Accordion.Item eventKey="1">
                      <Accordion.Header>Payment information</Accordion.Header>
                      <Accordion.Body>
                        {clientSecret && stripePromise && (
                          <Elements options={options} stripe={stripePromise}>
                            <PaymentForm placeOrder={placeOrder} />
                          </Elements>
                        )}
                        {!me || !me.username ? (
                          <Button onClick={() => setActive(0)}>Back</Button>
                        ) : null}{" "}
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                  {orderError && <p>{orderError}</p>}
                </Col>

                <Col md={4} className="mt-5">
                  <Table bordered>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map(({ id, product, qty }) => {
                        return (
                          <tr key={id}>
                            <td>
                              {product.name} x {qty}
                            </td>
                            <td>
                              ${parseFloat(product.price * qty).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                      <tr>
                        <th>Subtotal</th>
                        <th>${price}.00</th>
                      </tr>
                      <tr>
                        <th>Shipping</th>
                        <th>${6}</th>
                      </tr>
                      <tr>
                        <th>Total</th>
                        <th>${parseFloat(price + 6).toFixed(2)}</th>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Container>
          ) : (
            <div>
              Your cart is empty.{" "}
              <Link to="/products">Click here to browse our plants!</Link>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CheckoutPage;
