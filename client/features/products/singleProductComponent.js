import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectSingleProduct, fetchSingleProduct } from "../products/singleProductSlice";
import { Button, Card } from 'react-bootstrap';

const SingleProduct = () => {
    const dispatch = useDispatch();
    const { productId } = useParams();

    const singleProduct = useSelector(selectSingleProduct);
    const { name, cycle, watering, sunlight, largeImg, qty, price } = singleProduct;

    useEffect(() => {
        dispatch(fetchSingleProduct(productId));
    }, [dispatch]);

    return (
      <Card id="singleProduct" key={productId}>
        <Card.Title>{name}</Card.Title>
      {/* Note: Find out how to move image to the side in Bootstrap. Reference: https://mdbootstrap.com/docs/react/layout/flexbox/ */}
        <Card.Img src={largeImg}/>
        <Card.Text>{qty}</Card.Text>
        <Card.Text>{cycle}</Card.Text>
        <Card.Text>{watering}</Card.Text>
        <Card.Text>{sunlight}</Card.Text>
        <br/>
        <Button>Add to Cart</Button>
        <br/> 
        <Card.Footer>{price}</Card.Footer> 
     </Card>
    );
  };

  export default SingleProduct;