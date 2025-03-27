import React, { useEffect, useState, useMemo } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useGetProductsQuery } from "../slices/productsApiSlice";

import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";

const HomePage = () => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 4; // Number of products per page
  const { search } = useSelector((state) => state.search);

  // Fetch products from API
  const { data, isLoading, error } = useGetProductsQuery({
    limit,
    skip: (currentPage - 1) * limit,
    search,
  });

  // Memoized values to prevent unnecessary recalculations
  const total = data?.total || 0;
  const totalPage = useMemo(() => Math.ceil(total / limit), [total, limit]);

  // Function to handle pagination
  const pageHandler = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPage && pageNum !== currentPage) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <>
          {/* Display carousel only if not searching */}
          {!search && <ProductCarousel />}
          <Meta />
          <h1>Latest Products</h1>

          {/* Display product grid */}
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>

          {/* Show pagination only if there are multiple pages and no search is active */}
          {totalPage > 1 && !search && (
            <Paginate
              currentPage={currentPage}
              totalPage={totalPage}
              pageHandler={pageHandler}
            />
          )}
        </>
      )}
    </>
  );
};

export default HomePage;
