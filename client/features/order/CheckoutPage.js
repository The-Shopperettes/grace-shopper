import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCart,
  fetchCart,
  updateQty,
  deleteItem,
  addToCart,
} from "../cart/cartSlice";
import { Accordion, Form, Container, Row, Col, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const CheckoutPage = () => {
  const [active, setActive] = useState(8);
  const [loading, setLoading] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [price, setPrice] = useState(null);

  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.auth);
  const {cartItems} = useSelector(selectCart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    //if it's a user, start active at event key 1, else 0
    setActive(me && me.password ? 1 : 0);
  }, [me]);

  useEffect(() => {
    if(cartItems && cartItems.length) {
        setPrice(cartItems.reduce((sum, {product: {price}, qty}) => sum + (price * qty), 0));
    }
  }, [cartItems])

  function testEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  function placeOrder() {

  }

  //if there are no items in the cart, tell user to go to home
  return (
    <>
      {cartItems && cartItems.length ? <Container>
        <Row>
        <Col md={6}>
        <Accordion activeKey={[active.toString()]}>
        <h1>Checkout</h1>
          {!me || !me.password ? <Accordion.Item eventKey="0">
            <Accordion.Header>Account details</Accordion.Header>
            <Accordion.Body>
              <Form>
              <Button>
                    <Link to="/login"
                    style={{textDecoration: "none", color: "white"}}>Log in</Link>
                </Button>{' '}
                <Button>
                    <Link to="/signup"
                    style={{textDecoration: "none", color: "white"}}>Create an account</Link>
                </Button>
                <Form.Group style={{width: "25rem"}} className="mb-3">
                    <Form.Label>Enter email address to checkout as guest</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" required
                    onChange={(e) => setGuestEmail(e.target.value)}
                    />
                    <Form.Text className="text-muted">
                    {!guestEmail.length || testEmail(guestEmail) ? "" : "Please enter a valid email"}
                    </Form.Text>
                </Form.Group>
                <Button
                    disabled={!testEmail(guestEmail)}
                    onClick={() => setActive(1)}>Next</Button>
              </Form>
            </Accordion.Body> 
            </Accordion.Item>: null}
        
          <Accordion.Item eventKey="1">
            <Accordion.Header>Shipping Information</Accordion.Header>
            <Accordion.Body>
              Shipping info here
              <p></p>
              {guestEmail && guestEmail.length ? <Button onClick={() => setActive(0)}>Back</Button> : null} {' '}
              <Button onClick={() => setActive(2)}>Next</Button>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>Payment information</Accordion.Header>
            <Accordion.Body>
              Payment info here
              <p></p>
              <Button onClick={() => setActive(1)}>Back</Button>{' '}
              <Button onClick={placeOrder}>Place order</Button>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        </Col>
    <Col md={4}> 
    <Table bordered>
      <thead>
        <tr>
          <th>Product</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
      {
        cartItems.map(({id, product, qty}) => {
            return (<tr key={id}>
                <td>
                    {product.name} x {qty}
                </td>
                <td>
                    ${product.price * qty}.00
                </td>
            </tr>)
        })
      }
        <tr>
          <th>Subtotal</th>
          <th>${price}.00</th>
        </tr>
        <tr>
          <th>Shipping</th>
          <th>${5.99}</th>
        </tr>
        <tr>
          <th>Total</th>
          <th>${price+5.99}</th>
        </tr>
      </tbody>
    </Table>
    </Col> 
    </Row>
    </Container>
      : <div>Your cart is empty. <Link to="/products">Click here to browse our plants!</Link></div>}
    </>
  );
};

export default CheckoutPage;
