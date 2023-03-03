import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSingleProduct,
  fetchSingleProduct,
  deleteProduct,
} from "../products/singleProductSlice";
import { selectUser } from "../user/userSlice";
import { Button, Card, Form } from "react-bootstrap";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const singleProduct = useSelector(selectSingleProduct);
  const { name, cycle, watering, sunlight, smallImg, mediumImg, largeImg, qty, price } =
    singleProduct;

  useEffect(() => {
    dispatch(fetchSingleProduct(id));
  }, [dispatch]);

  //Have not confirmed functionality of this yet
  const isAdmin = useSelector(selectUser);

  //add handleDelete function for Delete button event listener
  //will delete product and then navigate back to all products page
  const Navigate = useNavigate();

  const handleDelete = async () => {
    await dispatch(deleteProduct(id));
    Navigate("/products");
  };

  return (
    <Card id="singleProduct" key={id}>
      <Card.Title>{name}</Card.Title>
      {/* Note: Find out how to move image to the side in Bootstrap. Reference: https://mdbootstrap.com/docs/react/layout/flexbox/ */}
      <Card.Img src={mediumImg} />
      <Card.Text>Cycle: {cycle}</Card.Text>
      <Card.Text>Watering: {watering}</Card.Text>
      <Card.Text>Sun Needs: {sunlight}</Card.Text>
      <br />
      <Button>Add to Cart</Button>
      <br />
      <Card.Footer>Price: ${price}</Card.Footer>
      <br/>
      {/* Have not confirmed functionality that only admins can view below info */}
      <h5>Admin View</h5>
      {isAdmin ? (
        <div>
          <Button onClick={handleDelete}>Delete Product</Button>
          <br/>
          <br/>
          {/* Edit functionality still in progress */}
          <p><b>Edit Product Details:</b></p>
          <p>Quantity (in-stock): {qty}</p>
            <Form>
            <Form.Group controlId="editQty">
                <Form.Label>Quantity (in-stock):</Form.Label>
                <Form.Control type="qty" placeholder="Edit product quantity" />
              </Form.Group>
              <Form.Group className="editProduct" controlId="editName">
                <Form.Label>Name:</Form.Label>
                <Form.Control type="name" placeholder="Edit product name" />
              </Form.Group>
              <Form.Group controlId="editCycle">
                <Form.Label>Cycle:</Form.Label>
                <Form.Control type="cycle" placeholder="Edit cycle details" />
              </Form.Group>
              <br/>
              <Form.Group controlId="editWatering">
                <Form.Label>Watering:</Form.Label>
                <Form.Control type="watering" placeholder="Edit watering details" />
              </Form.Group>
              <Form.Group controlId="editSunNeeds">
                <Form.Label>Sun Needs:</Form.Label>
                <Form.Control type="sunNeeds" placeholder="Edit sun needs details" />
              </Form.Group>
              <Form.Group controlId="editPrice">
                <Form.Label>Price:</Form.Label>
                <Form.Control type="price" placeholder="Edit product price" />
              </Form.Group>
              <Button variant="primary" type="submit">Submit Edits</Button>
            </Form>
        </div>
      ) : null}
    </Card>
  );
};

export default SingleProduct;
