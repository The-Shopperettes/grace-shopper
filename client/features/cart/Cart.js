import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCart, fetchCart } from './cartSlice';
import { Card, Button, Container, Stack, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const Cart = () => {
    const dispatch = useDispatch();
    const {cartItems} = useSelector(selectCart);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch])

    return (
    <Container>
        { cartItems ?
        <Stack gap={3}> 
            {
               cartItems.map(({id, product, qty}) => {
                return (
                <Card key={id} >
                <Stack direction='horizontal'>
                    <Card.Img src={product.thumbnail} style={{ height: '10rem', width: 'auto'}}></Card.Img>
                    <Card.Body>
                        
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>Quantity: {qty}</Card.Text>
                        <Card.Text>Price: ${product.price * qty}.00</Card.Text>
                        <Card.Text><Link to="">See details</Link></Card.Text>
                    </Card.Body>
                </Stack>
                </Card>)
            })
            }
            <Stack direction="horizontal">
            <div></div>
            <div className='ms-auto mt-3'>
                <h3>Total: ${cartItems.reduce((sum, {qty, product: {price}}) => sum + price*qty, 0)}.00</h3>
            </div>
            <Button variant="secondary" size="lg">
                Check out
            </Button>
            </Stack>
        
        </Stack> 
        
        : null
        }
    </Container>
    )

}

export default Cart;