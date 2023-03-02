import React from "react";
import { Pagination, Dropdown, Stack } from "react-bootstrap";

// TODO: update to include 9 as a dropdown
//a component allowing user to change pages and number of items to show on a page
// used by AllProducts components
const PageControls = (props) => {
  const { handlePageChange, handlePerPageChange, page, perPage, count } = props;

  //find the maximum possible pages
  const maxPages = Math.ceil(count / perPage);

  //changes the page by passing the new page to the parent
  const handleClick = (newPage) => {
    //don't do anything if the new page is invalid
    if (newPage < 1 || newPage === page || newPage > maxPages) return;
    handlePageChange(newPage);
  };

  //changes the number of items per page and page when the user selects a valid value on the dropdown
  const handleDropdownClick = (e) => {
    const newPerPage = e.target.tabIndex;
    if (newPerPage <= 0) return;
    //calculate the new page so that the viewer still sees the same students/campuses
    const newPage = Math.ceil(offset / newPerPage);
    handlePerPageChange(newPage, newPerPage);
  };

  const firstPageToShow = Math.max(page - 2, 1);
  const lastPageToShow = Math.min(firstPageToShow + 4, maxPages);

  //an array that will be mapped to create the pagination element
  let pageArray =
    count > perPage ? createArray(firstPageToShow, lastPageToShow, 1) : [];

  //an array that will be used to create the dropdown
  let dropdownArray = createArray(20, 100, 20, perPage);

  //calculate offset
  const offset = 1 + (page - 1) * perPage;

  return (
    <Stack direction="horizontal">
      <Pagination>
        {page > 1 ? <Pagination.First onClick={() => handleClick(1)} /> : null}
        {page > 2 ? (
          <Pagination.Prev onClick={() => handleClick(page - 1)} />
        ) : null}
        {pageArray.map((i) => {
          if (i == page)
            return (
              <Pagination.Item key={i} active>
                {page}
              </Pagination.Item>
            );
          return (
            <Pagination.Item onClick={() => handleClick(i)} key={i}>
              {i}
            </Pagination.Item>
          );
        })}
        {page < maxPages - 1 ? (
          <Pagination.Next onClick={() => handleClick(maxPages - 1)} />
        ) : null}
        {page < maxPages ? (
          <Pagination.Last onClick={() => handleClick(maxPages)} />
        ) : null}
      </Pagination>
      {count > 20 ? (
        <Dropdown className="d-inline mx-2" onClick={handleDropdownClick}>
          <Dropdown.Toggle id="dropdown-autoclose-false">
            Show {perPage}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {dropdownArray.map((i) => (
              <Dropdown.Item tabIndex={i} key={i}>
                Show {i}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      ) : null}
      <p>
        Showing {offset}-{Math.min(offset + perPage - 1, count)} of {count}
      </p>
    </Stack>
  );
};

//a helper function to create an array
const createArray = (start, end, step, exclude = null) => {
  let result = [];
  for (let i = start; i <= end; i += step) {
    if (i !== exclude) result.push(i);
  }
  return result;
};

export default PageControls;