import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Card,
  Row,
  Col,
  Nav,
  Button,
  Spinner,
} from "react-bootstrap";
import {
  fetchProductsAsync,
  selectProducts,
  resetProducts,
} from "./productsSlice";
import PageControls from "./pageControls";
import AddProduct from "./addProductAdmin";
import Filters from "./Filters";
import Sort from "./Sort";

const AllProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fetched, setFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState({
    cycle: [],
    sunlight: [],
    watering: [],
  });
  const [sort, setSort] = useState({ label: "Name (A-Z)", value: ["name"] });

  // fetch products and number of products (for pagination)
  const { products, productCount, error } = useSelector(selectProducts);

  // #region PAGINATION & SEARCH----------------------------------
  // get the searchQuery
  const [searchParams] = useSearchParams();
  let { page, perPage, search } = Object.fromEntries([...searchParams]);

  if (!search) search = "";

  // change page, perPage from strings to numbers
  page = Number(page);
  perPage = Number(perPage);

  // set page defaults if no valid values given (9 cards/page & page 1)
  if (!perPage || isNaN(perPage) || (perPage > 100) | (perPage < 9))
    perPage = 20;
  if (!page || isNaN(page)) page = 1;

  // once dispatch is created OR the page, perPage changes, fetch the products using the search query
  useEffect(() => {
    dispatch(resetProducts());
    setLoading(true);
    fetch();
    setFetched(true);
  }, [dispatch, search]);

  useEffect(() => {
    fetch();
  }, [page, perPage]);

  useEffect(() => {
    if ((error || products.length) && fetched) setLoading(false);
  }, [error, products]);

  useEffect(() => {
    navigate(`/products?page=1&perPage=${perPage}&search=${search}`);
    fetch();
  }, [selections, sort]);

  const fetch = () => {
    dispatch(
      fetchProductsAsync({
        page,
        perPage,
        search,
        selections,
        sort: sort.value,
      })
    );
  };

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
    navigate(
      `/products?page=${newPage}&perPage=${newPerPage}&search=${search}`
    );
  };

  const reset = () => {
    setSelections({
      cycle: [],
      sunlight: [],
      watering: [],
    });
    navigate("/products");
  };

  //defining user in order to use "isAdmin" property to render Add a Product functionality (for admins only)
  const user = useSelector((state) => {
    return state.auth.me;
  });

  // #endregion------------------------------------------

  // mapping to create products list. This is where the product cards are created. If the product quantity is sold out, a "sold out" header will appear.
  const ProductList = () =>
    products?.map((product, i) => {
      return (
        <Card className="plant-card" key={i}>
          {product.qty === 0 && <Card.Header>SOLD OUT</Card.Header>}
          <Card.Title as="h4" className="text-center plant-card-title">
            {product.name}
          </Card.Title>
          <Card.Img
            className="plant-card-img"
            src={product.thumbnail}
            onError={({ target }) => {
              target.src = "/default_img_med.jpeg";
            }}
          />
          <Card.Body>
            <Card.Text as="h5" className="text-center">
              Price: ${product.price}
            </Card.Text>
          </Card.Body>
          <Nav.Item className="text-center">
            <Link to={`/products/${product.id}`}>
              <Button variant="outline-dark"> See Details </Button>
            </Link>
          </Nav.Item>
        </Card>
      );
    });

  return (
    <Container id="all-products-container">
      {!loading ? (
        <>
          <Row xs={12}>
            <Col md={3}>
              <Filters selections={selections} setSelections={setSelections} />
            </Col>
            <Col xs={9}>
              <div id="results-header">
                <h3>
                  {search.length
                    ? `Showing ${productCount || 0} result${
                        productCount > 1 ? "s" : ""
                      } for "${search}"`
                    : "All plants"}
                </h3>
                {products.length > 1 && (
                  <Sort currentSort={sort} setCurrentSort={setSort} />
                )}
              </div>

              {products && products.length ? (
                <>
                  <section id="plant-list">
                    <ProductList />
                  </section>
                </>
              ) : (
                <Container fluid justifyContent="center">
                  <Button onClick={reset}>View all products</Button>
                </Container>
              )}
            </Col>
          </Row>
          {products.length > 1 && (
            <PageControls
              handlePageChange={handlePageChange}
              page={page}
              perPage={perPage}
              count={productCount}
              handlePerPageChange={handlePerPageChange}
            />
          )}
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
        </>
      ) : (
        <Container
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "3rem",
          }}
        >
          <h3>Loading our plants...</h3>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      )}
    </Container>
  );
};

export default AllProducts;
