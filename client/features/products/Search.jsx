import React, { useState, useEffect } from "react";
import { Form, InputGroup, Stack, Button } from "react-bootstrap";
import axios from "axios";

const Search = ({ searchVal, setSearchVal, search }) => {
  const [options, setOptions] = useState([]);

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
    setSearchVal("");
    setOptions([]);
    search();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={0}>
        <InputGroup className="mb-0">
          <Form.Control
            aria-label="search bar"
            id="search"
            onChange={updateOptions}
            value={searchVal}
            placeholder="What are you looking for?"
          />
          <Button disabled={searchVal.length < 1} type="submit">
            Search
          </Button>
        </InputGroup>

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
      </Stack>
    </Form>
  );
};

export default Search;
