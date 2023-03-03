import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectSingleProduct, fetchSingleProduct } from "../products/singleProductSlice";
import {addToCart} from '../cart/cartSlice';
import { Button, Card, Form } from 'react-bootstrap';

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

    // TODO: product Quantity: Need conditional to prevent going to 0, and cannot add more than (inventory - cart). If user tries, message pops up.
    return (
      <Card id="singleProduct" key={id} style = {{width: '50rem'}}>
        <Card.Title>{name}</Card.Title>
      {/* Note: Find out how to move image to the side in Bootstrap. Reference: https://mdbootstrap.com/docs/react/layout/flexbox/ */}
        <Card.Img src={mediumImg}/>
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
        {singleProduct.qty < 20 && <Card.Text>Low stock! Only ${qty} left!</Card.Text>}
        <br/>
        <Button style={{width: '10rem'}} onClick={handleAddToCart}>Add to Cart</Button>
        <br/> 
        <Card.Footer>Price: ${price}</Card.Footer> 
     </Card>
    );
  };

  export default SingleProduct;