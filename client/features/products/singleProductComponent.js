import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSingleProduct,
  fetchSingleProduct,
  deleteProduct,
} from "../products/singleProductSlice";
import EditProduct from "./editSingleProduct";
import { selectUser } from "../user/userSlice";
import { Button, Card } from "react-bootstrap";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const singleProduct = useSelector(selectSingleProduct);
  const { name, cycle, watering, sunlight, smallImg, mediumImg, largeImg, qty, price } =
    singleProduct;

  useEffect(() => {
    dispatch(fetchSingleProduct(id));
  }, [dispatch]);

  //This is not working, will need to edit later
  const isAdmin = useSelector(selectUser);

  //handleDelete function allows Delete button to remove a product
  //This will delete product and then navigate back to all products page
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
      {/* Admin-only functionality does not work, need to edit later */}
      <h5>Admin View</h5>
      {isAdmin ? (
        <div>
          <Button onClick={handleDelete}>Delete Product</Button>
          <br/>
          <br/>
          {/* NOTE: Currently each field in the form needs to have something in it for submit to work, though it can be the same value if no edit is needed.
          //Can change this later if needed */}
          <p><b>Edit Product Details (must enter every field before submit):</b></p>
            <p>Quantity (in-stock): {qty}</p>
         <div>
          <div>{<EditProduct />}</div>
        </div>
        </div>
      ) : null}

    </Card>
  );
};

export default SingleProduct;
