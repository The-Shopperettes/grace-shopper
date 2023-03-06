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
import { Button, Card, Form } from "react-bootstrap";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(0);

  const singleProduct = useSelector(selectSingleProduct);
  const { name, cycle, watering, sunlight, mediumImg, qty, price } = singleProduct;


  useEffect(() => {
    dispatch(fetchSingleProduct(id));
  }, [dispatch]);

  //  add product to cart
    const handleAddToCart = (event) => {
      event.preventDefault();
       dispatch(addToCart({productId: id, qty: quantity}));
    };
    
    //handleDelete function allows Delete button to remove a product
    //This will delete product and then navigate back to all products page
    const Navigate = useNavigate();

    const handleDelete = async () => {
      await dispatch(deleteProduct(id));
      Navigate("/products");
    };

    //Define user variable to access isAdmin property so only admins can access certain information on the page
    const user = useSelector((state) => {
      return state.auth.me;
    });

  // TODO: Product Quantity: Need to include conditional for decrement, can't be lower than 0: qty>=0. Need to include conditional for increment, can't add more than than (qty - product in cart quantity)
  return (
    <Card id="singleProduct" key={id} style = {{width: '50rem', backgroundColor: '#7BA842'}}>
      <Card.Title>{name}</Card.Title>
      {/* Note: Find out how to move image to the side in Bootstrap. Reference: https://mdbootstrap.com/docs/react/layout/flexbox/ */}
      <Card.Img src={mediumImg} />
      <Form>
        <Form.Control 
        style={{width: '10rem'}}
        type='number'
        value={quantity}
        onChange={(e) => {setQuantity(e.target.value)}}>
          </Form.Control>
        </Form>
      <Card.Text>Cycle: {cycle}</Card.Text>
      <Card.Text>Watering: {watering}</Card.Text>
      <Card.Text>Sun Needs: {sunlight}</Card.Text>
      <Card.Text>{singleProduct.qty < 20 && <Card.Text>Low stock! Only ${qty} left!</Card.Text>}</Card.Text>
      <br />
      <Button onClick={handleAddToCart} style={{width: '10rem'}}>Add to Cart</Button>
      <br />
      <Card.Footer style={{backgroundColor: 'white'}}>Price: ${price}</Card.Footer>
      <br/>
      {(user.isAdmin) ? (
        <div> 
          <h5>Admin View</h5>
          <Button onClick={handleDelete}>Delete Product</Button>
          <br/>
          <br/>
          {/* NOTE: Currently each field in the form needs to have something in it for submit to work, though it can be the same value if no edit is needed.
          */}
          <p><b>Edit Product Details:</b></p>
            <p><i>Note: Must enter a value in each field before submitting. Please add the current value for that product's detail if no change is needed.</i></p>
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
