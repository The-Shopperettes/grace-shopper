import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Container, Card, Row, Col, Nav, Button } from "react-bootstrap";
import { fetchProductsAsync, selectProducts } from "./productsSlice";
import PageControls from "./pageControls";
import AddProduct from "./addProductAdmin";
import Search from "./Search";
import Filters from "./Filters";
import Sort from "./Sort";

const AllProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState({
    cycle: [],
    sunlight: [],
    watering: [],
  });
  const [sort, setSort] = useState({ label: "Name (A-Z)", value: ["name"] });

  // fetch products and number of products (for pagination)
  const { products, productCount } = useSelector(selectProducts);

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
    dispatch(
      fetchProductsAsync({
        page,
        perPage,
        search,
        selections,
        sort: sort.value,
      })
    );
    setLoading(false);
  }, [dispatch, page, perPage, search]);

  useEffect(() => {
    navigate(`/products?page=1&perPage=${perPage}&search=${search}`);
    dispatch(
      fetchProductsAsync({
        page,
        perPage,
        search,
        selections,
        sort: sort.value,
      })
    );
  }, [selections, sort]);

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
    products?.map((product) => {
      return (
        <Card id="plant-card">
          {product.qty === 0 && <Card.Header>SOLD OUT</Card.Header>}
          <Card.Title as="h4" className="text-center">
            {product.name}
          </Card.Title>
          <Card.Img style={{ padding: ".5rem" }} src={product.thumbnail} />
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
      <Row xs={12}>
        <Col md={3}>
          <Filters selections={selections} setSelections={setSelections} />
        </Col>
        <Col xs={9}>
          <div id="results-header">
            <h3>
              {search.length
                ? `Showing ${productCount} result${
                    productCount > 1 ? "s" : ""
                  } for "${search}"`
                : "All plants"}
            </h3>
            <Sort currentSort={sort} setCurrentSort={setSort} />
          </div>

          {products && products.length ? (
            <>
              <section id="plant-list">
                <ProductList />
              </section>
            </>
          ) : (
            <section id="not-found">
              <h3 id="not-found-header">No products found</h3>
              <Button onClick={reset}>View all products</Button>
            </section>
          )}
        </Col>
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
