
import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {Accordion} from 'react-bootstrap';
import { fetchUser } from './userSlice';
import Orders from './Orders';


const User = () => {
  const dispatch = useDispatch();

  const { user, orders } = useSelector((state) => {
    return state.user;
  });

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <div>
      <div id="user-profile">
        {user && user.id ? (
          <div>
            <div id="user-header" style={{display: 'flex', flexWrap: 'wrap'}}>
              <img
                id="user-img"
                src="https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png"
              ></img>
              <div>
                <h2>{user.username}</h2>
                <h5>{user.email}</h5>
              </div>
            </div>
              <h4 style={{marginLeft: '5px'}}>Order History</h4>
              {orders && orders.length 
                ? <Orders orders={orders} /> : 'No previous transactions'}
          </div>
        ) : (
          "User not found"
        )}
      </div>
      <div>
        <footer className="foot" />
      </div>
     </div>
  );
};

export default User;
