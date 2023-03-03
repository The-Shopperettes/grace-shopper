import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { editProduct } from "./singleProductSlice";
import { Button, Form } from "react-bootstrap";

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  //editProduct function for 'edit product' form
  //Using state to update each field of the form

  const [name, setName] = useState("");
  const [cycle, setCycle] = useState("");
  const [watering, setWatering] = useState("");
  const [sunlight, setSunlight] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    await dispatch(editProduct({ id, name, cycle, watering, sunlight, qty, price }));
    setName("");
    setCycle("");
    setWatering("");
    setSunlight("");
    setQty("");
    setPrice("");
  };

  return (
    //NOTE: Currently each field in the form needs to have something in it for submit to work, though it can be the same value if no edit is needed
    //Can change this later if needed
    <div>
        <Form id="editProductForm" onSubmit={handleSubmit}>

            <Form.Group controlId="editQty">
                <Form.Label>Quantity (in-stock):</Form.Label>
                <Form.Control 
                type="qty" 
                placeholder="Edit product quantity" 
                value={qty}
                onChange={(event) => setQty(event.target.value) } />
              </Form.Group>

              <Form.Group controlId="editName">
                <Form.Label>Name:</Form.Label>
                <Form.Control 
                  type="name" 
                  placeholder="Edit product name"
                  value={name}
                  onChange={(event) => setName(event.target.value) }/>
              </Form.Group>

              <Form.Group controlId="editCycle">
                <Form.Label>Cycle:</Form.Label>
                <Form.Control 
                  type="cycle"
                  placeholder="Edit cycle details"
                  value={cycle}
                  onChange={(event) => setCycle(event.target.value) }/>
              </Form.Group>

              <br/>

              <Form.Group controlId="editWatering">
                <Form.Label>Watering:</Form.Label>
                <Form.Control 
                type="watering" 
                placeholder="Edit watering details"
                value={watering}
                onChange={(event) => setWatering(event.target.value) }/>
              </Form.Group>

              <Form.Group controlId="editSunNeeds">
                <Form.Label>Sun Needs:</Form.Label>
                <Form.Control 
                type="sunNeeds" 
                placeholder="Edit sun needs details"
                value={sunlight}
                onChange={(event) => setSunlight(event.target.value) }/>
              </Form.Group>

              <Form.Group controlId="editPrice">
                <Form.Label>Price:</Form.Label>
                <Form.Control 
                  type="price" 
                  placeholder="Edit price (without $)"
                  value={price} 
                  onChange={(event) => setPrice(event.target.value) }/>
              </Form.Group>

              <Button variant="primary" type="submit">Submit Edits</Button>
            </Form>
    </div>
  );
};

export default EditProduct;