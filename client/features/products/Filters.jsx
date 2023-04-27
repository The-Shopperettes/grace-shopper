import React, { useState } from "react";
import { Form, Card, Stack } from "react-bootstrap";
import { useSelector } from "react-redux";

//cycle, watering and sunlight
const Filters = ({ selections, setSelections }) => {
  const { filters } = useSelector((state) => state.products);
  const [showing, setShowing] = useState([true, true, true]);

  if (!filters.length) return <></>;

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

  const updateShowing = (i) => {
    let copy = [...showing];
    copy[i] = !showing[i];
    setShowing(copy);
  };

  const FilterSection = ({ type, options, show, update }) => {
    return (
      <section id="filter-option">
        <button className="unstyled-btn filter-head" onClick={update}>
          <h3 className="filter-title">{capitalize(type)}</h3>
          <span
            style={{
              transform: `rotate(${show ? "180deg" : "0deg"})`,
            }}
          >
            <i className="fa-sharp fa-solid fa-angle-up fa-lg"></i>
          </span>
        </button>

        <section style={show ? {} : { display: "none" }}>
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
    );
  };

  return (
    <Card id="filter-card">
      {filters.map((filter, i) => (
        <FilterSection
          {...filter}
          key={i}
          show={showing[i]}
          update={() => updateShowing(i)}
        />
      ))}
    </Card>
  );
};

export default Filters;
