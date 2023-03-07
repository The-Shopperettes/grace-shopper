import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { editProduct } from "./singleProductSlice";
import { Button, Form } from "react-bootstrap";

const EditProduct = ({product}) => {
  const dispatch = useDispatch();

  //editProduct function for 'edit product' form
  //Using state to update each field of the form

  const [name, setName] = useState(product.name);
  const [cycle, setCycle] = useState(product.cycle);
  const [watering, setWatering] = useState(product.watering);
  const [sunlight, setSunlight] = useState(product.sunlight);
  const [qty, setQty] = useState(product.qty);
  const [price, setPrice] = useState(product.price);
  const [scientificName, setScientificName] = useState(product.scientificName);

  const handleSubmit = async (event) => {
    if(!validateAll()) return;
    event.preventDefault();
    await dispatch(editProduct({ id: product.id, name, cycle, watering, sunlight, qty, price, scientificName }));
  };

  const validateQty = () => {
    return !isNaN(qty) && qty > 0;
  }

  const validateName = () => name.length > 0; 

  const validateCycle = () => cycle.length > 0;

  const validateWatering = () => watering.length > 0;

  const validateScientificName = () => scientificName.length > 0;

  const validatePrice = () => !isNaN(price) && price > 0;

  const validateAll = () => {
    return validateQty() && validateName() && validateCycle() && validateWatering() && validatePrice();
  }

  return (
    <div>
        {product && product.name && <Form id="editProductForm" onSubmit={handleSubmit}>

            <Form.Group controlId="editQty">
                <Form.Label>Quantity (in-stock):</Form.Label>
                <Form.Control 
                type="number" 
                placeholder="Edit product quantity" 
                value={qty}
                name="qty"
                onChange={({target}) => setQty(Number(target.value))} />
                <Form.Text>{!validateQty() && "Please enter a number greater than 0"}</Form.Text>
              </Form.Group>
              <Form.Group controlId="editName">
                <Form.Label>Name:</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Edit product name"
                  name="name"
                  value={name}
                  onChange={({target}) => setName(target.value)}/>
                  <Form.Text>{!validateName() && "Please enter a value"}</Form.Text>
              </Form.Group>

              <Form.Group controlId="editCycle">
                <Form.Label>Cycle:</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Edit cycle details"
                  value={cycle}
                  name="cycle"
                  onChange={({target}) => setCycle(target.value)}/>
                  <Form.Text>{!validateCycle() && "Please enter a value"}</Form.Text>
              </Form.Group>

              <br/>

              <Form.Group controlId="editWatering">
                <Form.Label>Watering:</Form.Label>
                <Form.Control 
                type="text"  
                placeholder="Edit watering details"
                value={watering}
                name="watering"
                onChange={({target}) => setWatering(target.value)}/>
                <Form.Text>{!validateWatering() && "Please enter a value"}</Form.Text>
              </Form.Group>

              <Form.Group controlId="editSunNeeds">
                <Form.Label>Sun Needs:</Form.Label>
                <Form.Control 
                type="text"  
                name="sunlight"
                value={sunlight}
                onChange={({target}) => setSunlight(target.value)}/>
              </Form.Group>

              <Form.Group controlId="editPrice">
                <Form.Label>Price:</Form.Label>
                <Form.Control 
                  type="number" 
                  name="price"
                  value={price} 
                  onChange={({target}) => setPrice(Number(target.value))}/>
                  <Form.Text>{!validatePrice() && "Please enter a number greater than 0"}</Form.Text>
              </Form.Group>

              <Form.Group controlId="editScientificName">
                <Form.Label>Scientific Name:</Form.Label>
                <Form.Control 
                  type="text" 
                  name="scientificName"
                  value={scientificName} 
                  onChange={({target}) => setScientificName(target.value)}/>
                  <Form.Text>{!validateScientificName() && "Please enter a value"}</Form.Text>
              </Form.Group>

              <Button variant="primary" type="submit" disabled={!validateAll()}>Submit Edits</Button>
            </Form>}
    </div>
  );
};

export default EditProduct;