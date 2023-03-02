import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCart, fetchCart, updateQty, deleteItem } from './cartSlice';
import { Card, Button, Container, Stack, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const Cart = () => {
    const dispatch = useDispatch();
    const {cartItems, cartId} = useSelector(selectCart);
    const [errorMessages, setErrorMessages] = useState({});


    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch])

    function changeQty({target}, itemId, totalQty) {
        //check that the change is valid
        const qty = Number(target.value);

        if(qty <= 0 || qty > totalQty || isNaN(qty)) {
            const err = {};
            err[itemId] = qty <= 0 ? 'Must enter a number greater than 0' : `Only ${totalQty} left in stock`;
            setErrorMessages(err);
            return;
        } 

        //send request to backend to change quantity of that item
        dispatch(updateQty({qty, itemId, cartId}));
    }

    function handleRemove(itemId) {
        dispatch(deleteItem(itemId));
    }

    function handleCheckout() {
        
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
                            style={{width: '6rem'}} 
                            type="number" 
                            value={qty}
                            onChange={(e) => {changeQty(e, id, product.qty)}}
                            ></Form.Control>
                            <Form.Text>{errorMessages[id] ? errorMessages[id] : ""}</Form.Text>
                        </Form>
                        <Card.Text>Price: ${product.price}.00</Card.Text>
                        <Button onClick={() => handleRemove(id)}>Remove item</Button>
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
                <Button variant="secondary" size="lg" onClick={handleCheckout}>
                Check out
                </Button>
            </div>
            
            </Stack>
        
        </Stack> 
        
        : <p>Your cart is empty. <Link to="/products">Click here to browse our plants</Link></p>
        }
    </Container>
    )

}

export default Cart;