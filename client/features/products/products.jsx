import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
  Link
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Container, Card, Row, Col, Nav, DropdownButton, Dropdown } from "react-bootstrap";
import { fetchProductsAsync, selectProducts } from "./productsSlice";
import PageControls from "./pageControls";

const AllProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lists, setList] = useState([]);

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
useEffect(() => {
  setList(products);
}, [products]);

// sorts products by their price
// ! PageControls is causing function to only apply to products on current page, need this to happen to ALL products.
const sortProducts = ((e) => {
  const productSpread = [...products];
  if (e.target.value === '0 to hero'){
    setList(productSpread.sort((a,b) => a.price - b.price));
  } else if (e.target.value === 'hero to 0'){
    setList(productSpread.sort((a,b) => b.price - a.price));
  }
});

// filter products by cycle
// TODO: need to include condition to reset aka all
// ! PageControls is causing function to only apply to products on current page, need this to happen to ALL products.
const cycleFilter = ((e) => {
  const productSpread = [...products];
  if (e.target.value === 'Biennial'){
    setList(productSpread.filter((p) => p.cycle.toLowerCase() === 'biennial'));
  } else if (e.target.value === 'Perennial'){
    setList(productSpread.filter((p) => p.cycle.toLowerCase() === 'perennial'));
  }  else if (e.target.value === 'Annual'){
    setList(productSpread.filter((p) => p.cycle.toLowerCase() === 'annual'));
  }
})

// filter products by watering needs
// TODO: need to include condition to reset aka all
// ! PageControls is causing function to only apply to products on current page, need this to happen to ALL products.
const wateringFilter = ((e) => {
  const productSpread = [...products];
  if (e.target.value === 'Average'){
    setList(productSpread.filter((p) => p.watering.toLowerCase() === 'average'));
  } else if (e.target.value === 'Minimum'){
    setList(productSpread.filter((p) => p.watering.toLowerCase() === 'minimum'));
  }  else if (e.target.value === 'Frequent'){
    setList(productSpread.filter((p) => p.watering.toLowerCase() === 'frequent'));
  }
})


// #endregion------------------------------------------


  // mapping to create products list. This is where the product cards are created. If the product quantity is sold out, a "sold out" header will appear.
  const productList = lists?.map((list) => {
    return (
      <Col gap={3} key={product.id}>
        <Card  style={{width: '22rem', margin: '1rem'}}>
          {list.qty ===0 && <Card.Header>SOLD OUT</Card.Header>}
          <Card.Title as='h4' className='text-center'>{list.name}</Card.Title>
          <Card.Img style={{padding: '.5rem'}} src={list.mediumImg} />
          <Card.Body>
            <Card.Text as='h5' className='text-center'>Price: ${list.price}</Card.Text>
          </Card.Body>
          <Nav.Item className='text-center'>
            <Link to={`/products/${list.id}`}> See More </Link>
          </Nav.Item>
        </Card>
      </Col>
    );
  });

  return (
    <Container>
      <DropdownButton 
    title='Cycle' 
    menuVariant="dark"
    >
      <Dropdown.Item as='button' value='Biennial' onClick={cycleFilter}>Biennial</Dropdown.Item>
      <Dropdown.Item as='button' value='Perennial' onClick={cycleFilter}>Perennial</Dropdown.Item>
      <Dropdown.Item as='button' value='Annual' onClick={cycleFilter}>Annual</Dropdown.Item>
    </DropdownButton>
    <DropdownButton 
    title='Watering' 
    menuVariant="dark"
    >
      <Dropdown.Item as='button' value='Average' onClick={wateringFilter}>Average</Dropdown.Item>
      <Dropdown.Item as='button' value='Minimum' onClick={wateringFilter}>Minimum</Dropdown.Item>
      <Dropdown.Item as='button' value='Frequent' onClick={wateringFilter}>Frequent</Dropdown.Item>
    </DropdownButton>
      <DropdownButton 
    title='Sort' 
    align='end' 
    menuVariant="dark"
    >
      <Dropdown.Item as='button' value='0 to hero' onClick={sortProducts}>Low to High</Dropdown.Item>
      <Dropdown.Item as='button' value='hero to 0' onClick={sortProducts}>High to Low</Dropdown.Item>
    </DropdownButton>
      <Row xs={1} md={3} gap={3}>
        {lists && lists.length ? productList : "No products here"}
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