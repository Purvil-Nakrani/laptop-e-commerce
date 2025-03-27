import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Button, ListGroup, Card, Image } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import CheckoutSteps from '../components/CheckoutSteps';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import Meta from '../components/Meta';
import { addCurrency } from '../utils/addCurrency';

const PlaceOrderPage = () => {
  // Extract necessary data from Redux store
  const {
    cartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = useSelector(state => state.cart);

  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect if shipping address or payment method is missing
  useEffect(() => {
    if (!shippingAddress) navigate('/shipping');
    if (!paymentMethod) navigate('/payment');
  }, [shippingAddress, paymentMethod, navigate]);

  // Function to handle order placement
  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      }).unwrap();

      // Clear cart and navigate to order confirmation page
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to place order');
    }
  };

  return (
    <>
      {/* Checkout progress steps */}
      <CheckoutSteps step1 step2 step3 step4 />
      <Meta title="Place Order" />

      <Row>
        {/* Left Section: Shipping, Payment, and Order Items */}
        <Col md={8}>
          <ListGroup variant="flush">
            {/* Shipping Details */}
            <ListGroup.Item>
              <h2>Shipping</h2>
              <strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
            </ListGroup.Item>

            {/* Payment Method */}
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method:</strong> {paymentMethod}
            </ListGroup.Item>

            {/* Order Items */}
            <ListGroup.Item>
              <h2>Order Items</h2>
              <ListGroup variant="flush">
                {cartItems.map(item => (
                  <ListGroup.Item key={item._id}>
                    <Row>
                      <Col md={2}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col md={6}>
                        <Link
                          to={`/product/${item._id}`}
                          className="product-title text-dark"
                          style={{ textDecoration: 'none' }}
                        >
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={4}>
                        {item.qty} x {addCurrency(item.price)} = {addCurrency(item.qty * item.price)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Right Section: Order Summary */}
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              {/* Items Price */}
              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>{addCurrency(Number(itemsPrice))}</Col>
                </Row>
              </ListGroup.Item>

              {/* Shipping Price */}
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>{addCurrency(Number(shippingPrice))}</Col>
                </Row>
              </ListGroup.Item>

              {/* Tax Price */}
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>{addCurrency(Number(taxPrice))}</Col>
                </Row>
              </ListGroup.Item>

              {/* Total Price */}
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>{addCurrency(Number(totalPrice))}</Col>
                </Row>
              </ListGroup.Item>

              {/* Place Order Button */}
              <ListGroup.Item>
                <Button
                  className="w-100"
                  variant="warning"
                  disabled={cartItems.length === 0 || isLoading}
                  onClick={placeOrderHandler}
                >
                  {isLoading ? <Loader /> : 'Place Order'}
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderPage;
