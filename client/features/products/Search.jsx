import React, { useState, useEffect } from "react";
import { Form, InputGroup, Stack, Button, Container } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router";

const Search = () => {
  const [options, setOptions] = useState([]);
  const [searchVal, setSearchVal] = useState("");

  const navigate = useNavigate();

  const updateOptions = async ({ target: { value } }) => {
    setSearchVal(value);
    if (!value) {
      setOptions([]);
      return;
    }

    const { data } = await axios.get(
      `/api/products/autocomplete?search=${value}`
    );

    setOptions(data);
  };

  const selectOption = (option) => {
    setOptions([]);
    setSearchVal(option);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/products?search=${searchVal}`);
  };

  return (
    <Form onSubmit={handleSubmit} id="search-form">
      <Stack gap={0} style={{ margin: 0 }}>
        <InputGroup style={{ margin: 0 }}>
          <span className="search-bar">
            <Form.Control
              aria-label="search bar"
              onChange={updateOptions}
              value={searchVal}
              placeholder="What are you looking for?"
              style={{ borderRadius: 0, backgroundColor: "#FFFBFC" }}
              id="search-input"
            />
            <section id="autocomplete">
              {options?.map((option, i) => (
                <button
                  type="button"
                  className="searchOption"
                  key={i}
                  onClick={() => selectOption(option)}
                >
                  {option}
                </button>
              ))}
            </section>
          </span>

          <Button
            type="submit"
            style={{ backgroundColor: "#395B50", border: "1px solid #395B50" }}
          >
            Search
          </Button>
        </InputGroup>
      </Stack>
    </Form>
  );
};

export default Search;
