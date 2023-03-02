import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
  Link
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Container, Card, Row, Col, Nav } from "react-bootstrap";
import { fetchProductsAsync, selectProducts } from "./productsSlice";
import PageControls from "./pageControls";

const AllProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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

  // mapping to create products list. This is where the product cards are created
  const productList = products?.map((product) => {
    return (
      <Col gap={3} key={product.id}>
        <Card>
          <Card.Title>{product.name}</Card.Title>
          <Card.Img src={product.mediumImg} />
          <Card.Body>
            <Card.Text>Price: ${product.price}</Card.Text>
          </Card.Body>
          <Nav.Item>
            <Link to={`/products/${product.id}`}> See More </Link>
          </Nav.Item>
        </Card>
      </Col>
    );
  });

  return (
    <Container>
      <Row xs={1} md={3} gap={3}>
        {products && products.length ? productList : "No products here"}
      </Row>
      ;
      <PageControls
        handlePageChange={handlePageChange}
        page={page}
        perPage={perPage}
        count={productCount}
        handlePerPageChange={handlePerPageChange}
      />
    </Container>
  );
};

export default AllProducts;