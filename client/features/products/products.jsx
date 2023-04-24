import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Container, Card, Row, Col, Nav, Button } from "react-bootstrap";
import { fetchProductsAsync, selectProducts } from "./productsSlice";
import PageControls from "./pageControls";
import AddProduct from "./addProductAdmin";
import Search from "./Search";
import Filters from "./Filters";

const AllProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState("");

  // fetch products and number of products (for pagination)
  const { products, productCount } = useSelector(selectProducts);

  // #region PAGINATION & SEARCH----------------------------------
  // get the searchQuery
  const [searchParams] = useSearchParams();
  let { page, perPage, search } = Object.fromEntries([...searchParams]);

  // change page, perPage from strings to numbers
  page = Number(page);
  perPage = Number(perPage);

  // set default search
  if (!search) search = "";

  // set page defaults if no valid values given (9 cards/page & page 1)
  if (!perPage || isNaN(perPage) || (perPage > 100) | (perPage < 9))
    perPage = 9;
  if (!page || isNaN(page)) page = 1;

  // once dispatch is created OR the page, perPage changes, fetch the products using the search query
  useEffect(() => {
    dispatch(fetchProductsAsync({ page, perPage, search }));
    setLoading(false);
  }, [dispatch, page, perPage, search]);

  const getQuery = () => `&search=${searchVal}`;

  // when products/productCount changes, make sure the current page is valid
  useEffect(() => {
    if (!loading && page > Math.ceil(productCount / perPage)) {
      const maxPage = Math.ceil(productCount / perPage);
      navigate(`/products?page=${maxPage}&perPage=${perPage}&search=${search}`);
    }
  }, [products, productCount]);

  // changes page
  const handlePageChange = (newPage) => {
    navigate(`/products?page=${newPage}&perPage=${perPage}&search=${search}`);
  };

  // change page and perPage
  const handlePerPageChange = (newPage, newPerPage) => {
    navigate(`/products?${newPage}&perPage=${newPerPage}&search=${search}`);
  };

  // handle user search
  const handleUpdate = () => {
    navigate(`/products?${page}&perPage=${perPage}${getQuery()}`);
  };

  //defining user in order to use "isAdmin" property to render Add a Product functionality (for admins only)
  const user = useSelector((state) => {
    return state.auth.me;
  });

  // #endregion------------------------------------------

  // mapping to create products list. This is where the product cards are created. If the product quantity is sold out, a "sold out" header will appear.
  const productList = products?.map((product) => {
    return (
      <Col gap={3} key={product.id}>
        <Card
          id="plant-card"
          style={{ width: "22vw", margin: "1.5vw", padding: "5px" }}
        >
          {product.qty === 0 && <Card.Header>SOLD OUT</Card.Header>}
          <Card.Title as="h4" className="text-center">
            {product.name}
          </Card.Title>
          <Card.Img style={{ padding: ".5rem" }} src={product.mediumImg} />
          <Card.Body>
            <Card.Text as="h5" className="text-center">
              Price: ${product.price}
            </Card.Text>
          </Card.Body>
          <Nav.Item className="text-center">
            <Link to={`/products/${product.id}`}>
              <Button variant="outline-dark"> See More </Button>
            </Link>
          </Nav.Item>
        </Card>
      </Col>
    );
  });

  return (
    <Container id="all-products-container">
      <Search
        searchVal={searchVal}
        setSearchVal={setSearchVal}
        search={handleUpdate}
      />
      <Filters />
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
      <div>
        {/* Admin only section begins here*/}
        {user && user.isAdmin && (
          <div>
            <br />
            <h5>
              <b>Admin View</b>
            </h5>
            <p>
              <b>Add Product:</b>
            </p>
            <div>
              <div>{<AddProduct />}</div>
            </div>
          </div>
        )}
      </div>
      <br></br>
      <br></br>
    </Container>
  );
};

export default AllProducts;
