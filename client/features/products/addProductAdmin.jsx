import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import axios from "axios";

const AddProduct = () => {
  //Use state on all variables required to create a new product
  const [name, setName] = useState("");
  const [cycle, setCycle] = useState("");
  const [watering, setWatering] = useState("");
  const [sunlight, setSunlight] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  //Create function to dispatch addProduct thunk when the addProduct form is submitted
  const handleSubmit = async (event) => {
    if (!validateAll()) return;
    event.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post('/api/products', {
        name,
        cycle,
        watering,
        sunlight,
        qty: Number(qty),
        price: Number(price),
        scientificName,
      });

      if(data.id) navigate(`/products/${data.id}`);
      setLoading(false);

    } catch(err) {
      console.error(err);
    }
  };

  const validateQty = () => {
    return !isNaN(qty) && qty > 0;
  };

  const validateName = () => name.length > 0;

  const validateCycle = () => cycle.length > 0;

  const validateWatering = () => watering.length > 0;

  const validateScientificName = () => scientificName.length > 0;

  const validatePrice = () => !isNaN(price) && price > 0;

  const validateAll = () => {
    return (
      validateQty() &&
      validateName() &&
      validateCycle() &&
      validateWatering() &&
      validatePrice()
    );
  };

  return (
    //NOTE: Currently each field in the form needs to have something in it for submit to work to add a new product
    <div>
      <Form id="addProductForm" onSubmit={handleSubmit}>
        <Form.Group controlId="addQty">
          <Form.Label>Quantity (in-stock):</Form.Label>
          <Form.Control
            type="number"
            name="qty"
            placeholder="Enter product quantity"
            value={qty}
            onChange={({ target }) => setQty(Number(target.value))}
          />
          <Form.Text>
            {!validateQty() && "Please enter a number greater than 0"}
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="addName">
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter product name"
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
          <Form.Text>{!validateName() && "Please enter a value"}</Form.Text>
        </Form.Group>

        <Form.Group controlId="addCycle">
          <Form.Label>Cycle:</Form.Label>
          <Form.Control
            type="text"
            name="cycle"
            placeholder="Enter cycle details"
            value={cycle}
            onChange={({ target }) => setCycle(target.value)}
          />
          <Form.Text>{!validateCycle() && "Please enter a value"}</Form.Text>
        </Form.Group>

        <br />

        <Form.Group controlId="addWatering">
          <Form.Label>Watering:</Form.Label>
          <Form.Control
            type="text"
            name="watering"
            placeholder="Enter watering details"
            value={watering}
            onChange={({ target }) => setWatering(target.value)}
          />
          <Form.Text>{!validateWatering() && "Please enter a value"}</Form.Text>
        </Form.Group>

        <Form.Group controlId="addSunNeeds">
          <Form.Label>Sun Needs:</Form.Label>
          <Form.Control
            type="text"
            name="sunlight"
            value={sunlight}
            onChange={({ target }) => setSunlight(target.value)}
          />
          <Form.Text>{"Please enter a value"}</Form.Text>
        </Form.Group>

        <Form.Group controlId="addPrice">
          <Form.Label>Price:</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={price}
            onChange={({ target }) => setPrice(Number(target.value))}
          />
          <Form.Text>
            {!validatePrice() && "Please enter a number greater than 0"}
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="addScientificName">
          <Form.Label>Scientific Name:</Form.Label>
          <Form.Control
            type="text"
            name="scientificName"
            value={scientificName}
            onChange={({ target }) => setScientificName(target.value)}
          />
          <Form.Text>
            {!validateScientificName() && "Please enter a value"}
          </Form.Text>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={!validateAll() || loading}>
          {!loading ? "Add Product" : "Loading..."}
        </Button>
      </Form>
    </div>
  );
};

export default AddProduct;
