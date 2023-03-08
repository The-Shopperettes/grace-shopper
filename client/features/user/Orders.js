import React from "react";
import { Accordion, Card, Stack, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Orders = ({ orders }) => {
  return (
    <Accordion defaultActiveKey="">
      {orders.map(({ id, cartItems}) => {
        return (
          <Accordion.Item key={id} eventKey={id}>
            <Accordion.Header>Order #{id}</Accordion.Header>
            <Accordion.Body>
            <Row xs={1} md={3} gap={3}>
              {cartItems.map(({ id, product, qty }) => (
                <Col gap={3} key={id}>
                <Card key={id} className="mt-3" >
                  <Stack direction="horizontal">
                    <Card.Img
                      src={product.thumbnail}
                      style={{ height: "7rem", width: "auto" }}
                    ></Card.Img>
                    <Card.Body>
                      <Card.Text>Price: ${product.price}.00</Card.Text>
                      <Card.Text>Quantity: {qty}</Card.Text>
                      <Card.Text>
                        <Link to={`/products/${product.id}`}>See details</Link>
                      </Card.Text>
                    </Card.Body>
                  </Stack>
                </Card>
                </Col>
              ))}
              </Row>
            </Accordion.Body>
            <Accordion.Body>
            <h2>
              Total: $
              {cartItems.reduce((sum, { qty, product }) => {
                return sum + product.price * qty;
              }, 6)}
            </h2>
            </Accordion.Body>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
};

export default Orders;

 