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
    // get the searchQuery
    const [searchParams] = useSearchParams();
    let params = Object.fromEntries([...searchParams]);
    let {page, perPage} = Object.fromEntries([...searchParams]);

  const [search, setSearch] = useState(params.search || '');
  const [cycle, setCycle] = useState(params.cycle || '');
  const [watering, setWatering] = useState(params.watering || ''); 
  const [sort, setSort] = useState(params.sort || 'DESC')

  // fetch products and number of products (for pagination)
  const { products, productCount } = useSelector(selectProducts);

  // #region PAGINATION & SEARCH----------------------------------


  // change page, perPage from strings to numbers
  page = Number(page);
  perPage = Number(perPage);

  const runQuery = () => {
    let query = '';
    if (cycle) {
      query += `&cycleFilter=${cycle}`;
    }
    if (watering) {
      query += `&waterFilter=${watering}`;
    }
    if (sort) {
      query += `&sort=${sort}`;
    }
    if (search) {
      query += `&search=${search}`;
    }
    return query;
  }
     

  // set page defaults if no valid values given (9 cards/page & page 1)
  if (!perPage || isNaN(perPage) || (perPage > 100) | (perPage < 9))
    perPage = 9;
  if (!page || isNaN(page)) page = 1;

  // once dispatch is created OR the page, perPage changes, fetch the products
  useEffect(() => {
    dispatch(fetchProductsAsync({ page, perPage, query:runQuery() }));
    setLoading(false);
  }, [dispatch, page,  perPage]);

  // when products/productCount changes, make sure the current page is valid
  useEffect(() => {
    if (!loading && page > productCount / perPage) {
      const maxPage = Math.ceil(productCount / perPage);
      navigate(`/products?page=${maxPage}&perPage=${perPage}${runQuery()}`);
    }
  }, [products, productCount]);

  // changes page
  const handlePageChange = (newPage) => {
    navigate(`/products?page=${newPage}&perPage=${perPage}${runQuery()}`);
  };

  // change page and perPage
  const handlePerPageChange = (newPage, newPerPage) => {
    navigate(`/products?${newPage}&perPage=${newPerPage}${runQuery()}`);
  };

  // #endregion------------------------------------------

// #region FILTER & SORT----------------------------------
// sets the local products state to the original fetchProductsAsync thunk (all products)
// useEffect(() => {
//   setList(products);
// }, [products]);

// searches products based on search bar input
const handleSearch = ((e) => {
 
  e.preventDefault();
  setSearch(e.target.value)
  console.log(runQuery())
  navigate(`/products?${page}&perPage=${perPage}${runQuery()}`);
  // dispatch(fetchProductsAsync({page, perPage, query: runQuery()}));
})

// sorts products by their price
// ! PageControls is causing function to only apply to products on current page, need this to happen to ALL products.
const sortProducts = ((e) => {

  setSort(e.target.value)
  console.log(runQuery())
  navigate(`/products?${page}&perPage=${perPage}${runQuery()}`);
  // dispatch(fetchProductsAsync({page, perPage, query: runQuery() }));
});

// filter products by cycle
// ! PageControls is causing function to only apply to products on current page, need this to happen to ALL products.
const cycleFilter = ((e) => {
  
  if (e.target.value === 'All'){
    setCycle('');
    navigate(`/products?${page}&perPage=${perPage}${runQuery()}`);
    // dispatch(fetchProductsAsync({page, perPage, query:runQuery()}));
  } else {
    setCycle(e.target.value)
    console.log(runQuery())
    navigate(`/products?${page}&perPage=${perPage}${runQuery()}`);
    // dispatch(fetchProductsAsync({page, perPage, query: runQuery()}));
  }
})

// filter products by watering needs
// ! PageControls is causing function to only apply to products on current page, need this to happen to ALL products.
const wateringFilter = ((e) => {
  if (e.target.value === 'All'){
    setWatering('');
    navigate(`/products?${page}&perPage=${perPage}${runQuery()}`);
    // dispatch(fetchProductsAsync({page, perPage, query: runQuery()}));
  } else {
    setWatering(e.target.value)
    console.log(runQuery())

    navigate(`/products?${page}&perPage=${perPage}${runQuery()}`);
    // dispatch(fetchProductsAsync({page, perPage, query: runQuery()}));
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
          <Button type='submit' variant='outline-success' onClick={handleSearch}>Search</Button>
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