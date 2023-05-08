import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCart,
  fetchCart,
  updateQty,
  deleteItem,
  clearCart,
} from "./cartSlice";
import {
  Card,
  Button,
  Container,
  Stack,
  Form,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems, cartId } = useSelector(selectCart);
  const [errorMessages, setErrorMessages] = useState({});
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  function changeQty({ target }, itemId, totalQty) {
    //check that the change is valid
    const qty = Number(target.value);

    if (qty <= 0 || qty > totalQty || isNaN(qty)) {
      const err = {};
      err[itemId] =
        qty <= 0
          ? "Must enter a number greater than 0"
          : `Only ${totalQty} left in stock`;
      setErrorMessages(err);
      return;
    }

    //send request to backend to change quantity of that item
    dispatch(updateQty({ qty, itemId, cartId }));
  }

  function handleRemove(itemId) {
    dispatch(deleteItem(itemId));
  }

  function handleCheckout() {
    navigate("/checkout");
  }

  function handleClear() {
    dispatch(clearCart());
    setShowModal(false);
  }

  const seeModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const linkStyle = {
    margin: "15px",
    color: "#2e2823",
  };

  const ConfirmationModal = () => {
    return (
      <Modal show={showModal}>
        <Modal.Header>
          <Modal.Title>Are you sure you want to clear your cart?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button onClick={handleClear}>Clear cart</Button>
          <br></br>
          <br></br>
          <Button onClick={closeModal}>Don't clear cart</Button>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <Container id="cart-container" className="mt-6" fluid>
      <ConfirmationModal />
      {cartItems && cartItems.length ? (
        <Row>
          <Col xs={7} sm='auto'>
            <Row style={{width: 'auto'}}>
              {cartItems.map(({ id, product, qty }) => {
                return (
                  <Card key={id} id="cart-card" className="m-2">
                    <Stack direction="horizontal">
                      <Card.Header style={{ textAlign: "center" }}>
                        <Card.Img
                          src={product.thumbnail}
                        ></Card.Img>
                        <Card.Text>
                          <Link
                            to={`/products/${product.id}`}
                            style={linkStyle}
                          >
                            See details
                          </Link>
                        </Card.Text>
                      </Card.Header>
                      <Card.Body>
                        <Card.Title style={{ fontWeight: "bold" }}>
                          {product.name}
                        </Card.Title>
                        {product.qty <= 20 || qty >= product.qty - 10 ? (
                          <Card.Text style={{ color: "red" }}>
                            Only {product.qty} left in stock. Order soon!
                          </Card.Text>
                        ) : null}
                        <Form>
                          Quantity:
                          <Form.Control
                            style={{ width: "6rem" }}
                            type="number"
                            value={qty}
                            onChange={(e) => {
                              changeQty(e, id, product.qty);
                            }}
                          ></Form.Control>
                          <Form.Text>
                            {errorMessages[id] && product.qty > 20
                              ? errorMessages[id]
                              : ""}
                          </Form.Text>
                        </Form>
                        <Card.Text>Price: ${product.price}.00</Card.Text>
                        <Button
                          variant="secondary"
                          onClick={() => handleRemove(id)}
                        >
                          Remove item
                        </Button>
                      </Card.Body>
                    </Stack>
                  </Card>
                );
              })}
              <Button
                variant="dark"
                style={{ width: "20vw" }}
                onClick={seeModal}
                className="m-2"
              >
                Clear cart
              </Button>
            </Row>
          </Col>

          <Col xs={4} className="m-4">
            <h3>
              Total: $
              {cartItems.reduce(
                (sum, { qty, product: { price } }) => sum + price * qty,
                0
              )}
              .00
            </h3>
            <Button variant="success" size="lg" onClick={handleCheckout}>
              Check out
            </Button>
          </Col>
        </Row>
      ) : (
        <p>
          Your cart is empty.{" "}
          <Link to="/products">Click here to browse our plants</Link>
        </p>
      )}
    </Container>
  );
};

export default Cart;
