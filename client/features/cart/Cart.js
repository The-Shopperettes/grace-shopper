import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCart, fetchCart } from './cartSlice';


const Cart = () => {
    const dispatch = useDispatch();
    const {cartItems} = useSelector(selectCart);

    useEffect(() => {
        dispatch(fetchCart(5));
    }, [dispatch])

    return (
        <div>Cart</div>
    )

}

export default Cart;