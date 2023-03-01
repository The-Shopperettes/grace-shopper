import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCart, fetchCart, updateQty } from './cartSlice';
import { Card, Button, Container, Stack, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const Cart = () => {
    const dispatch = useDispatch();
    const {cartItems, cartId} = useSelector(selectCart);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch])

    function changeQty({target}, itemId, totalQty) {
        //check that the change is valid
        const qty = Number(target.value);
        
        if(qty <= 0 || qty > totalQty || isNaN(qty)) return; 

        //send request to backend to change quantity of that item
        dispatch(updateQty({qty, itemId, cartId}));
    }

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
                        <Form>
                            Quantity: 
                            <Form.Control 
                            style={{width: '4rem'}} 
                            type="number" 
                            value={qty}
                            onChange={(e) => changeQty(e, id, product.qty)}
                            ></Form.Control>
                        </Form>
                        <Card.Text>Price: ${product.price}.00</Card.Text>
                        <Card.Text><Link to="">See details</Link></Card.Text>
                    </Card.Body>
                </Stack>
                </Card>)
            })
            }
            <Stack direction="horizontal">
            <div></div>
            <div className='ms-auto mt-3'>
                <h3>Total: ${cartItems.reduce((sum, {qty, product: {price}}) => sum + (price*qty), 0)}.00</h3>
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