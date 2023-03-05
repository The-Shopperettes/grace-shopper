import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSingleProduct,
  fetchSingleProduct,
  deleteProduct,
} from "../products/singleProductSlice";
import {addToCart} from '../cart/cartSlice';
import EditProduct from "./editSingleProduct";
import { selectUser } from "../user/userSlice";
import { Button, Card, Form, Modal, Container } from "react-bootstrap";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const [qtyMessage, setQtyMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const singleProduct = useSelector(selectSingleProduct);
  const { name, cycle, watering, sunlight, mediumImg, qty, price } = singleProduct;


  useEffect(() => {
    dispatch(fetchSingleProduct(id));
  }, [dispatch]);

  //  add product to cart
    const handleAddToCart = (event) => {
      event.preventDefault();
       dispatch(addToCart({productId: id, qty: quantity}));
       setShowModal(true);
    };
    
    //handleDelete function allows Delete button to remove a product
    //This will delete product and then navigate back to all products page
    const navigate = useNavigate();

    const handleDelete = async () => {
      await dispatch(deleteProduct(id));
      navigate("/products");
    };

    const handleQuantityChange = ({target: {value}}) => {
      value = Number(value);
      if(value < 1 || isNaN(value)) return;
      //update to also check qty in cart
      if(value > qty) {
        setQtyMessage(`Only ${qty} in stock`);
        return;
      }
      setQuantity(value);
    }

    const viewCart = () => {
      navigate('/cart');
    }

    const closeModal = () => {
      setShowModal(false);
      setQuantity(1);
    }

    const ConfirmationModal = () => {
      return (
        <Modal show={showModal}>
        <Modal.Header>
          <Modal.Title>Added {quantity} {name} to cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button onClick={viewCart}>View cart</Button>
          <br></br>
          <br></br>
          <Button onClick={closeModal}>Continue shopping</Button>
        </Modal.Body>
      </Modal>
      )
    }

  return (
    <Container>
    <ConfirmationModal />
    <Card id="singleProduct" key={id} style = {{width: '50rem'}}>
      <Card.Title>{name}</Card.Title>
      {/* Note: Find out how to move image to the side in Bootstrap. Reference: https://mdbootstrap.com/docs/react/layout/flexbox/ */}
      <Card.Img src={mediumImg} />
      {qty > 0 && <Form>
        <Form.Control 
        style={{width: '10rem'}}
        type='number'
        value={quantity}
        onChange={handleQuantityChange}>
          </Form.Control>
          {qtyMessage && <Form.Text>{qtyMessage}</Form.Text>}
        </Form>}
      <Card.Text>Cycle: {cycle}</Card.Text>
      <Card.Text>Watering: {watering}</Card.Text>
      <Card.Text>Sun Needs: {sunlight}</Card.Text>
      <Card.Text>{singleProduct.qty < 20 && <Card.Text>{qty <= 0 ? 'Sold out!' : `Low stock! Only ${qty} left!`}</Card.Text>}</Card.Text>
      <br />
      <Button onClick={handleAddToCart} style={{width: '10rem'}} disabled={qty <= 0}>Add to Cart</Button>
      <br />
      <Card.Footer>Price: ${parseFloat(price).toFixed(2)}</Card.Footer>
      <br/>
      {/* Admin-only functionality does not work, need to edit later */}
      <h5>Admin View</h5>
      {/* {isAdmin ? ( */}
        <div>
          <Button onClick={handleDelete}>Delete Product</Button>
          <br/>
          <br/>
          {/* NOTE: Currently each field in the form needs to have something in it for submit to work, though it can be the same value if no edit is needed.
          //Can change this later if needed */}
          <p><b>Edit Product Details:</b></p>
            <p><i>Note: Must enter a value in each field before submitting. Please add the current value for that product's detail if no change is needed.</i></p>
            <p>Quantity (in-stock): {qty}</p>
         <div>
          <div>{<EditProduct />}</div>
        </div>
        </div>
      {/* ) : null} */}

    </Card>
    </Container>
  );
};

export default SingleProduct;
