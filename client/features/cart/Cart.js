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

    setErrorMessages({});

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
          <Col
            xs={7}
            sm="auto"
            style={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
            }}
          >
            {cartItems.map(({ id, product, qty }) => {
              return (
                <Row
                  xs={12}
                  key={id}
                  style={{ display: "block", minWidth: "50vw" }}
                >
                  <Card
                    id="cart-card"
                    className="m-2"
                    style={{ display: "block", width: "100%" }}
                  >
                    <Container
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      <Card.Header
                        style={{ textAlign: "center", width: "12rem" }}
                      >
                        <Card.Img
                          src={product.thumbnail}
                          style={{ minWidth: "10rem" }}
                          onError={({ target }) => {
                            target.src = "/default_img_thumb.jpeg";
                          }}
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
                      <Card.Body style={{ width: "12rem" }}>
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
                            defaultValue={qty}
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
                    </Container>
                  </Card>
                </Row>
              );
            })}
            <Button
              variant="dark"
              style={{ minWidth: "10rem", maxWidth: "25rem" }}
              onClick={seeModal}
              className="m-2"
            >
              Clear cart
            </Button>
          </Col>

          <Col
            xs={4}
            className="m-4"
            style={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
            }}
          >
            <h3>
              Total: $
              {cartItems.reduce(
                (sum, { qty, product: { price } }) => sum + price * qty,
                0
              )}
              .00
            </h3>
            <Button
              variant="success"
              size="lg"
              onClick={handleCheckout}
              style={{ minWidth: "10rem", maxWidth: "25rem" }}
            >
              Check out
            </Button>
          </Col>
        </Row>
      ) : (
        <Card id="empty-cart">
          Your cart is empty.{" "}
          <Link to="/products">Click here to browse our plants</Link>
        </Card>
      )}
    </Container>
  );
};

export default Cart;
