import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import { fetchUser } from "./userSlice";

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
            <header id="user-header">
              <img
                id="user-img"
                src="https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png"
              ></img>
              <div>
                <h2>{user.username}</h2>
                <h5>{user.email}</h5>
              </div>
            </header>
            <ListGroup id="orders-list">
              <h4>Order History</h4>
              {orders && orders.length
                ? orders.map((order) => {
                    return (
                      <ListGroup.Item
                        style={{ width: "40vw", backgroundColor: "#dddcdc" }}
                      >
                        Order #{order.id}
                      </ListGroup.Item>
                    );
                  })
                : "No previous transactions"}
            </ListGroup>
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
