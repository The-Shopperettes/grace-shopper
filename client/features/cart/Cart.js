import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCart, fetchCart } from './cartSlice';
import { Card, Button, Container, Stack, Row, Col } from 'react-bootstrap';


const Cart = () => {
    const dispatch = useDispatch();
    const {cartItems} = useSelector(selectCart);

    useEffect(() => {
        dispatch(fetchCart(5));
    }, [dispatch])

    return (
    <Container>
        { cartItems ?
        <Stack> 
            {
               cartItems.map(({id, product, qty}) => {
                return (
                <Card>
                    <Card.Body>
                        <Card.Img src={product.mediumImg}></Card.Img>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>
                        <p>Quantity: {qty}</p>
                        <p>Price: ${product.price}.00</p>
                        </Card.Text>
                    </Card.Body>
                </Card>)
            })
            }
        </Stack> : null
        }
    </Container>
    )

}

export default Cart;