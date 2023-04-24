import React, { useState, useEffect } from "react";
import { Form, Dropdown, Badge, Accordion } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";

//cycle, watering and sunlight
const Filters = () => {
  const [selections, setSelections] = useState({
    cycle: [],
    sunlight: [],
    watering: [],
  });

  const { filters } = useSelector((state) => state.products);

  const capitalize = (str) => {
    return str
      .split(" ")
      .map((word) => {
        if (word[0]) return word[0].toUpperCase() + word.slice(1);
      })
      .join(" ");
  };

  const handleToggle = (value, type) => {
    let copy = { ...selections };
    const idx = copy[type].findIndex((item) => item === value);

    if (idx >= 0) {
      copy[type] = [...copy[type].slice(0, idx), ...copy[type].slice(idx + 1)];
    } else {
      copy[type].push(value);
    }

    setSelections(copy);
  };

  return (
    <Accordion defaultActiveKey={[0, 1, 2]} alwaysOpen>
      {filters.map(({ type, options }, i) => (
        <Accordion.Item key={i} eventKey={i}>
          <Accordion.Header>{capitalize(type)}</Accordion.Header>
          <Accordion.Body>
            {options.map(({ count, value }, i) => {
              if (value.length > 0)
                return (
                  <Form.Check
                    key={i}
                    checked={selections[type].includes(value)}
                    label={`${capitalize(value)} (${count})`}
                    onChange={() => handleToggle(value, type)}
                  />
                );
            })}
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default Filters;
