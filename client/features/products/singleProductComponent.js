import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSingleProduct,
  fetchSingleProduct,
  deleteProduct,
  reset,
} from "../products/singleProductSlice";
import { addToCart } from "../cart/cartSlice";
import EditProduct from "./editSingleProduct";
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
    dispatch(reset());
    dispatch(fetchSingleProduct(id));
  }, [dispatch]);

  //  add product to cart
  const handleAddToCart = (event) => {
    event.preventDefault();
    let num = Number(quantity);
    if (isNaN(num) || num <= 0 || num > qty) return;

    dispatch(addToCart({ productId: id, qty: num }));
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
    let num = Number(value);
    if (isNaN(num) || num <= 0)
      setQtyMessage("Please enter a number greater than 0");
    //update to also check qty in cart
    else if (num > qty) setQtyMessage(`Only ${qty} in stock`);
    else setQtyMessage("");
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
          <Button onClick={viewCart} variant="secondary">
            View cart
          </Button>
          <br></br>
          <br></br>
          <Button onClick={closeModal} variant="secondary">
            Continue shopping
          </Button>
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
          <Card id="single-product" key={id}>
            <Stack
              direction={{ md: "horizontal", sm: "vertical" }}
              style={{ alignItems: "flex-start" }}
            >
              <div className="single-stack">
                <Card.Img
                  src={mediumImg}
                  className="single-img"
                  alt={`Image of ${name} plant`}
                  onError={({ target }) => {
                    target.src = "/default_img_med.jpeg";
                  }}
                />
              </div>
              <Stack direction="vertical" gap={3} className="single-stack">
                <Card.Title style={{ fontWeight: "bold", fontSize: "30px" }}>
                  {name}
                </Card.Title>
                <Card.Title>Price: ${parseFloat(price).toFixed(2)}</Card.Title>
                {qty > 0 && (
                  <Form>
                    <Form.Control
                      style={{ width: "10rem" }}
                      type="number"
                      onChange={handleQuantityChange}
                      value={quantity}
                    ></Form.Control>
                    {qtyMessage && <Form.Text>{qtyMessage}</Form.Text>}
                  </Form>
                )}
                <Card.Body
                  style={{
                    alignItems: "flex-start",
                    padding: "0",
                  }}
                >
                  <Card.Text>Cycle: {cycle}</Card.Text>
                  <Card.Text>Watering: {watering}</Card.Text>
                  <Card.Text>Sun Needs: {sunlight}</Card.Text>
                  <Card.Text>
                    {singleProduct.qty < 20 && (
                      <Card.Text>
                        {qty <= 0
                          ? "Sold out!"
                          : `Low stock! Only ${qty} left!`}
                      </Card.Text>
                    )}
                  </Card.Text>
                </Card.Body>
                <br />
                <Button
                  variant="secondary"
                  onClick={handleAddToCart}
                  style={{ width: "10rem" }}
                  disabled={qty <= 0}
                >
                  Add to Cart
                </Button>
              </Stack>
            </Stack>

            <br />
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
    </div>
  );
};

export default SingleProduct;
