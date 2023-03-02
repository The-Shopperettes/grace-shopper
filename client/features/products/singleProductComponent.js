import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectSingleProduct, fetchSingleProduct } from "../products/singleProductSlice";
import { Button, Card } from 'react-bootstrap';

const SingleProduct = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const singleProduct = useSelector(selectSingleProduct);
    const { name, cycle, watering, sunlight, largeImg, qty, price } = singleProduct;

    useEffect(() => {
        dispatch(fetchSingleProduct(id));
    }, [dispatch]);

    return (
      <Card id="singleProduct" key={id}>
        <Card.Title>{name}</Card.Title>
      {/* Note: Find out how to move image to the side in Bootstrap. Reference: https://mdbootstrap.com/docs/react/layout/flexbox/ */}
        <Card.Img src={largeImg}/>
        <Card.Text>Cycle: {cycle}</Card.Text>
        <Card.Text>Watering: {watering}</Card.Text>
        <Card.Text>Sun Needs: {sunlight}</Card.Text>
        <br/>
        <Button>Add to Cart</Button>
        <br/> 
        <Card.Footer>Price: ${price}</Card.Footer> 
     </Card>
    );
  };

  export default SingleProduct;