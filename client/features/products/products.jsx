import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
  Link
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Container, Card, Row, Col, Nav, DropdownButton, Dropdown, Form, Button } from "react-bootstrap";
import { fetchProductsAsync, selectProducts } from "./productsSlice";
import PageControls from "./pageControls";

const AllProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // fetch products and number of products (for pagination)
  const { products, productCount } = useSelector(selectProducts);

  // #region PAGINATION & SEARCH----------------------------------
  // get the searchQuery
  const [searchParams] = useSearchParams();
  let { page, perPage } = Object.fromEntries([...searchParams]);

  // change page, perPage from strings to numbers
  page = Number(page);
  perPage = Number(perPage);

  // set page defaults if no valid values given (9 cards/page & page 1)
  if (!perPage || isNaN(perPage) || (perPage > 100) | (perPage < 9))
    perPage = 9;
  if (!page || isNaN(page)) page = 1;

  // once dispatch is created OR the page, perPage changes, fetch the products using the search query
  useEffect(() => {
    dispatch(fetchProductsAsync({ page, perPage }));
    setLoading(false);
  }, [dispatch, page, perPage]);

  // when products/productCount changes, make sure the current page is valid
  useEffect(() => {
    if (!loading && page > productCount / perPage) {
      const maxPage = Math.ceil(productCount / perPage);
      navigate(`/products?page=${maxPage}&perPage=${perPage}`);
    }
  }, [products, productCount]);

  // changes page
  const handlePageChange = (newPage) => {
    navigate(`/products?page=${newPage}&perPage=${perPage}`);
  };

  // change page and perPage
  const handlePerPageChange = (newPage, newPerPage) => {
    navigate(`/products?${newPage}&perPage=${newPerPage}`);
  };

  // #endregion------------------------------------------

// #region FILTER & SORT----------------------------------
// sets the local products state to the original fetchProductsAsync thunk (all products)
// useEffect(() => {
//   setList(products);
// }, [products]);

// searches products based on search bar input
const handleSearch = ((e) => {
  dispatch(fetchProductsAsync({page, perPage, search: search}));
})

// sorts products by their price
// ! PageControls is causing function to only apply to products on current page, need this to happen to ALL products.
const sortProducts = ((e) => {
  dispatch(fetchProductsAsync({page, perPage, sort: e.target.value }));
});

// filter products by cycle
// ! PageControls is causing function to only apply to products on current page, need this to happen to ALL products.
const cycleFilter = ((e) => {
  if (e.target.value === 'All'){
    dispatch(fetchProductsAsync({page, perPage}));
  } else {
    dispatch(fetchProductsAsync({page, perPage, cycleFilter: e.target.value}));
  }
})

// filter products by watering needs
// ! PageControls is causing function to only apply to products on current page, need this to happen to ALL products.
const wateringFilter = ((e) => {
  if (e.target.value === 'All'){
    dispatch(fetchProductsAsync({page, perPage}));
  } else {
    dispatch(fetchProductsAsync({page, perPage, waterFilter: e.target.value}));
  }
})




// #endregion------------------------------------------


  // mapping to create products list. This is where the product cards are created. If the product quantity is sold out, a "sold out" header will appear.
  const productList = products?.map((product) => {
    return (
      <Col gap={3} key={product.id}>
        <Card  style={{width: '22rem', margin: '1rem'}}>
          {product.qty ===0 && <Card.Header>SOLD OUT</Card.Header>}
          <Card.Title as='h4' className='text-center'>{product.name}</Card.Title>
          <Card.Img style={{padding: '.5rem'}} src={product.mediumImg} />
          <Card.Body>
            <Card.Text as='h5' className='text-center'>Price: ${product.price}</Card.Text>
          </Card.Body>
          <Nav.Item className='text-center'>
            <Link to={`/products/${product.id}`}> See More </Link>
          </Nav.Item>
        </Card>
      </Col>
    );
  });

  return (
    <Container>
      <div className='d-flex justify-content-between'>
        <Form>
          <Form.Control
          type='search'
          placeholder='search'
          onChange = { (e) => setSearch(e.target.value)}
          >
            </Form.Control>
          <Button variant='outline-success' onClick={handleSearch}>Search</Button>
        </Form>
        <span className = 'd-flex justify-content-start'>
      <DropdownButton 
    title='Cycle' 
    menuVariant="dark"
    >
      <Dropdown.Item as='button' value='All' onClick={cycleFilter}>All</Dropdown.Item>
      <Dropdown.Item as='button' value='Biennial' onClick={cycleFilter}>Biennial</Dropdown.Item>
      <Dropdown.Item as='button' value='Perennial' onClick={cycleFilter}>Perennial</Dropdown.Item>
      <Dropdown.Item as='button' value='Annual' onClick={cycleFilter}>Annual</Dropdown.Item>
    </DropdownButton>
    <DropdownButton 
    title='Watering' 
    menuVariant="dark"
    >
      <Dropdown.Item as='button' value='All' onClick={wateringFilter}>All</Dropdown.Item>
      <Dropdown.Item as='button' value='Average' onClick={wateringFilter}>Average</Dropdown.Item>
      <Dropdown.Item as='button' value='Minimum' onClick={wateringFilter}>Minimum</Dropdown.Item>
      <Dropdown.Item as='button' value='Frequent' onClick={wateringFilter}>Frequent</Dropdown.Item>
    </DropdownButton>
    </span>
      <DropdownButton 
    title='Sort by price' 
    menuVariant="dark"
    >
      <Dropdown.Item as='button' value='ASC' onClick={sortProducts}>Low to High</Dropdown.Item>
      <Dropdown.Item as='button' value='DESC' onClick={sortProducts}>High to Low</Dropdown.Item>
    </DropdownButton>
    </div>
      <Row xs={1} md={3} gap={3}>
        {products && products.length ? productList : "No products here"}
      </Row>
      <PageControls
        handlePageChange={handlePageChange}
        page={page}
        perPage={perPage}
        count={productCount}
        handlePerPageChange={handlePerPageChange}
      />
    </Container>
)};

export default AllProducts;