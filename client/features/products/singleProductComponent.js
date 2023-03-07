import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSingleProduct,
  fetchSingleProduct,
  deleteProduct,
} from "../products/singleProductSlice";
import { addToCart } from "../cart/cartSlice";
import EditProduct from "./editSingleProduct";
import { selectUser } from "../user/userSlice";
import { Button, Card, Form, Modal, Container, Stack } from "react-bootstrap";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const [qtyMessage, setQtyMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const singleProduct = useSelector(selectSingleProduct);
  const { name, cycle, watering, sunlight, mediumImg, qty, price } =
    singleProduct;

  useEffect(() => {
    dispatch(fetchSingleProduct(id));
  }, [dispatch]);

  //  add product to cart
  const handleAddToCart = (event) => {
    event.preventDefault();
    dispatch(addToCart({ productId: id, qty: quantity }));
    setShowModal(true);
  };

  //handleDelete function allows Delete button to remove a product
  //This will delete product and then navigate back to all products page
  const navigate = useNavigate();

  const handleDelete = async () => {
    await dispatch(deleteProduct(id));
    navigate("/products");
  };

  //Define user variable to access isAdmin property so only admins can access certain information on the page
  const user = useSelector((state) => {
    return state.auth.me;
  });

  const handleQuantityChange = ({ target: { value } }) => {
    value = Number(value);
    if (value < 1 || isNaN(value)) return;
    //update to also check qty in cart
    if (value > qty) {
      setQtyMessage(`Only ${qty} in stock`);
      return;
    }
    setQuantity(value);
  };

  const viewCart = () => {
    navigate("/cart");
  };

  const closeModal = () => {
    setShowModal(false);
    setQuantity(1);
  };

  const ConfirmationModal = () => {
    return (
      <Modal show={showModal}>
        <Modal.Header>
          <Modal.Title>
            Added {quantity} {name} to cart
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button onClick={viewCart}>View cart</Button>
          <br></br>
          <br></br>
          <Button onClick={closeModal}>Continue shopping</Button>
        </Modal.Body>
      </Modal>
    );
  };

  // TODO: Product Quantity: Need to include conditional for decrement, can't be lower than 0: qty>=0. Need to include conditional for increment, can't add more than than (qty - product in cart quantity)
  return (
    <div>
      <Container id="single-container">
        <ConfirmationModal />
        {singleProduct && singleProduct.id && (
          <Card id="singleProduct" key={id}>
            <Stack direction="horizontal">
              <div className="single-stack">
                <Card.Title style={{ fontWeight: "bold", margin: "20px auto" }}>
                  {name}
                </Card.Title>
                {qty > 0 && (
                  <Form>
                    <Form.Control
                      style={{ width: "10rem" }}
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                    ></Form.Control>
                    {qtyMessage && <Form.Text>{qtyMessage}</Form.Text>}
                  </Form>
                )}
                <Card.Text>Cycle: {cycle}</Card.Text>
                <Card.Text>Watering: {watering}</Card.Text>
                <Card.Text>Sun Needs: {sunlight}</Card.Text>
              </div>
              <div className="single-stack">
                <Card.Img src={mediumImg} style={{ width: "30vw" }} />
              </div>
            </Stack>
            <Card.Text>
              {singleProduct.qty < 20 && (
                <Card.Text>
                  {qty <= 0 ? "Sold out!" : `Low stock! Only ${qty} left!`}
                </Card.Text>
              )}
            </Card.Text>
            <br />
            <Card.Title style={{ margin: "25px" }}>
              Price: ${parseFloat(price).toFixed(2)}
            </Card.Title>
            <br />
            <Button
              variant="secondary"
              onClick={handleAddToCart}
              style={{ width: "10rem", margin: "20px" }}
              disabled={qty <= 0}
            >
              Add to Cart
            </Button>
            <br />
            {/* <Card.Footer>
            Price: ${parseFloat(price).toFixed(2)}
          </Card.Footer> */}
            <br />
            {user && user.isAdmin && (
              <div id="single-admin-view">
                <h5 id="admin-title">Admin View</h5>
                <Button style={{ margin: "20px" }} onClick={handleDelete}>
                  Delete Product
                </Button>
                <br />
                <br />
                <EditProduct product={singleProduct} />
              </div>
            )}
          </Card>
        )}
      </Container>
      <div>
        <footer className="foot" />
      </div>
    </div>
  );
};

export default SingleProduct;
