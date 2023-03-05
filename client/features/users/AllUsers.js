import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Container, Card, Row, Col, Nav, Button } from "react-bootstrap";
import { fetchUsersAsync, selectUsers } from "./allUsersSlice";
import PageControls from "../products/pageControls";
import axios from "axios";

const AllUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const { users, usersCount } = useSelector(selectUsers);

  const [searchParams] = useSearchParams();
  let { page, perPage } = Object.fromEntries([...searchParams]);

  // change page, perPage from strings to numbers
  page = Number(page);
  perPage = Number(perPage);

  // set page defaults if no valid values given (9 cards/page & page 1)
  if (!perPage || isNaN(perPage) || (perPage > 100) | (perPage < 20))
    perPage = 20;
  if (!page || isNaN(page)) page = 1;

  // once dispatch is created OR the page, perPage changes, fetch the users using the search query
  useEffect(() => {
    dispatch(fetchUsersAsync({ page, perPage }));
    setLoading(false);
  }, [dispatch, page, perPage]);

  // when users/usersCount changes, make sure the current page is valid
  useEffect(() => {
    if (!loading && page > usersCount / perPage) {
      const maxPage = Math.ceil(usersCount / perPage);
      navigate(`/?page=${maxPage}&perPage=${perPage}`);
    }
  }, [users, usersCount]);

  // changes page
  const handlePageChange = (newPage) => {
    navigate(`/allUsers?page=${newPage}&perPage=${perPage}`);
  };

  // change page and perPage
  const handlePerPageChange = (newPage, newPerPage) => {
    navigate(`/allUsers?${newPage}&perPage=${newPerPage}`);
  };

  const deleteUser = async (id) => {
    const token = window.localStorage.getItem("token");
    try {
      await axios.delete(`/api/users/${id}`, {
        headers: {
          authorization: token,
        },
      });

      dispatch(fetchUsersAsync({page, perPage}));
    } catch (error) {
      console.error(error);
    }
  };

  const usersList = users.map(({ id, username, isAdmin, email, orders }) => {
    return (
      <Card key={id} style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>User #{id}</Card.Title>
          <Card.Text>Username: {username}</Card.Text>
          <Card.Text>Email: {email}</Card.Text>
          <Card.Text>Role: {isAdmin ? "Administrator" : "User"}</Card.Text>
          <Card.Text>{orders.length} previous orders</Card.Text>
          <Button onClick={() => deleteUser(id)}>Delete User</Button>
        </Card.Body>
      </Card>
    );
  });

  return (
    <Container>
      <h1>All users</h1>
      <p>
        Showing {(page - 1) * perPage + 1}-{(page - 1) * perPage + perPage} out
        of {usersCount} users
      </p>
      <Row xs={1} md={3} gap={3}>
        {users && users.length ? usersList : "No users here"}
      </Row>
      <PageControls
        handlePageChange={handlePageChange}
        page={page}
        perPage={perPage}
        count={usersCount}
        handlePerPageChange={handlePerPageChange}
      />
    </Container>
  );
};

export default AllUsers;
