import React, { useState } from 'react';
import {
  Row,
  Col,
  ListGroup,
  Button,
  Image,
  Card,
  Form,
  ListGroupItem
} from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetProductDetailsQuery,
  useCreateProductReviewMutation
} from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addCurrency } from '../utils/addCurrency';
import Reviews from '../components/Reviews';

const ProductPage = () => {
  const { id: productId } = useParams();

  // Local state for quantity, rating, and comment
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // Get user info from Redux store
  const { userInfo } = useSelector(state => state.auth);

  // Fetch product details from API
  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

  // Create product review mutation
  const [createProductReview, { isLoading: isReviewLoading }] =
    useCreateProductReviewMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Add product to cart handler
  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  // Submit product review handler
  const submitHandler = async e => {
    e.preventDefault();
    try {
      const res = await createProductReview({ productId, rating, comment });

      // Handle potential errors from response
      if (res.error) {
        toast.error(res.error?.data?.message || 'Failed to submit review');
        return;
      }

      toast.success(res.data.message || 'Review submitted successfully');
      setRating(0);
      setComment('');
    } catch (error) {
      toast.error(error?.data?.message || 'Something went wrong');
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
          {/* Back Button */}
          <Link to="/" className="btn btn-light my-3">
            Go Back
          </Link>

          {/* Page Metadata */}
          <Meta title={product.name} description={product.description} />

          <Row>
            {/* Left Column: Product Image and Reviews */}
            <Col md={5}>
              <Image src={product.image} alt={product.name} fluid />

              {/* Reviews (Visible only on larger screens) */}
              <Row className="review d-none d-md-block">
                <Col>
                  <Reviews
                    product={product}
                    userInfo={userInfo}
                    rating={rating}
                    loading={isReviewLoading}
                    setRating={setRating}
                    comment={comment}
                    setComment={setComment}
                    submitHandler={submitHandler}
                  />
                </Col>
              </Row>
            </Col>

            {/* Middle Column: Product Details */}
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                </ListGroup.Item>
                <ListGroup.Item>Price: {addCurrency(product.price)}</ListGroup.Item>
                <ListGroup.Item>
                  <strong>About this item:</strong> {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            {/* Right Column: Purchase Options */}
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  {/* Price Section */}
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>{addCurrency(product.price)}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {/* Stock Availability */}
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</Col>
                    </Row>
                  </ListGroup.Item>

                  {/* Quantity Selection (if in stock) */}
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty:</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={e => setQty(Number(e.target.value))}
                          >
                            {Array.from({ length: product.countInStock }, (_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  {/* Add to Cart Button */}
                  <ListGroupItem>
                    <Button
                      className="w-100"
                      variant="warning"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Add To Cart
                    </Button>
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          {/* Reviews (Visible only on smaller screens) */}
          <Row className="review d-block d-md-none">
            <Col md={6}>
              <Reviews
                product={product}
                userInfo={userInfo}
                rating={rating}
                loading={isReviewLoading}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                submitHandler={submitHandler}
              />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductPage;
