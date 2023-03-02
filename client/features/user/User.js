import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {ListGroup} from 'react-bootstrap';
import { fetchUser } from './userSlice';


const User = () => {
// BASED ON ROUTE -> PASS IN USER ID
const dispatch = useDispatch();
const {id} = useParams();
const user = useSelector((state) => {
    return state.user;
});

useEffect(() => {
    dispatch(fetchUser(id))
}, [dispatch, id]);

// TO FIX: user.orders is never coming up false;
return (
    <div>
        <header id='user-header'>
            <img src='https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png'></img>
            <div>
                <h3>{user.username}</h3> 
                <h5>{user.email}</h5>
            </div>
        </header>
        <h4>Order History</h4>
        <ListGroup>
            {user.orders 
                ? user.orders.map((order) => {
                    return (
                        <ListGroup.Item>Order #{order.id}</ListGroup.Item>
                )
            }) : 'No previous transactions'}
        </ListGroup>
    </div>
)
};

export default User;