import React from "react";
import { Form, Card } from "react-bootstrap";
import { useSelector } from "react-redux";

//cycle, watering and sunlight
const Filters = ({ selections, setSelections }) => {
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
    <Card id="filter-card">
      {filters.map(({ type, options }, i) => (
        <section key={i} id="filter-option">
          <h3 id="filter-title">{capitalize(type)}</h3>
          <section>
            {[...options]
              .sort((a, b) => a.value.localeCompare(b.value))
              .map(({ count, value }, i) => {
                if (value.length > 0)
                  return (
                    <Form.Check
                      key={i}
                      checked={selections[type].includes(value)}
                      label={`${capitalize(value)} (${count || 0})`}
                      onChange={() => handleToggle(value, type)}
                      className={
                        selections[type].includes(value) ? "checked-filter" : ""
                      }
                    />
                  );
              })}
          </section>
        </section>
      ))}
    </Card>
  );
};

export default Filters;
