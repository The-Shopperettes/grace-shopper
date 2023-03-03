import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectSingleProduct, fetchSingleProduct } from "../products/singleProductSlice";
import addToCart from '../cart/cartSlice';
import { Button, Card } from 'react-bootstrap';

const SingleProduct = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [getQuantity, setQuantity] = useState(0);

    const singleProduct = useSelector(selectSingleProduct);
    const { name, cycle, watering, sunlight, mediumImg, qty, price } = singleProduct;

    useEffect(() => {
        dispatch(fetchSingleProduct(id));
    }, [dispatch]);

    /**
     * on button click, add to cart
     * after item has been added to cart
     */
    const handleAddToCart = async () => {
      await dispatch(addToCart({id, qty}));
    }

    // TODO: Add +/- buttons & a field to display quantity. Need conditional to prevent going to 0, and cannot add more than (inventory - cart). If user tries, message pops up.
    return (
      <Card id="singleProduct" key={id}>
        <Card.Title>{name}</Card.Title>
      {/* Note: Find out how to move image to the side in Bootstrap. Reference: https://mdbootstrap.com/docs/react/layout/flexbox/ */}
        <Card.Img src={mediumImg}/>
        <Button onClick={() => {setQuantity = getQuantity--}}>-</Button>
        {getQuantity}
        <Button onClick={() => {setQuantity=getQuantity++}}>+</Button>
        <Card.Text>Cycle: {cycle}</Card.Text>
        <Card.Text>Watering: {watering}</Card.Text>
        <Card.Text>Sun Needs: {sunlight}</Card.Text>
        {productsSlice.qty < 20 && <Card.Text>Low stock! Only ${qty} left!</Card.Text>}
        <br/>
        <Button onClick={handleAddToCart}>Add to Cart</Button>
        <br/> 
        <Card.Footer>Price: ${price}</Card.Footer> 
     </Card>
    );
  };

  export default SingleProduct;