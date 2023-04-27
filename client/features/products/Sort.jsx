import React from "react";
import { Dropdown } from "react-bootstrap";

//sort products by price or name
const Sort = ({ currentSort, setCurrentSort }) => {
  const orders = [
    { label: "Price (low to high)", value: ["price"] },
    { label: "Price (high to low)", value: ["price", "DESC"] },
    { label: "Name (A-Z)", value: ["name"] },
    { label: "Name (Z-A)", value: ["name", "DESC"] },
  ];

  return (
    <section style={{ display: "flex", alignItems: "center" }}>
      <h3 id="sort-h3">Sort by</h3>
      <Dropdown onSelect={(key) => setCurrentSort(orders[key])}>
        <Dropdown.Toggle id="dropdown-basic" size="sm" variant="secondary">
          {currentSort.label}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {orders.map(({ label }, i) => (
            <Dropdown.Item
              eventKey={i}
              key={i}
              active={currentSort.label === label}
              variant="secondary"
            >
              {label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </section>
  );
};

export default Sort;
