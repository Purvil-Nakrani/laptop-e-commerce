import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import {
  Row,
  Col,
  Card,
  ListGroup,
  Form,
  Image,
  Button,
  ListGroupItem,
} from "react-bootstrap";

import Message from "../components/Message";
import Meta from "../components/Meta";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import { addCurrency } from "../utils/addCurrency";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  // Function to update item quantity in cart
  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  // Function to remove item from cart
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  // Function to handle checkout process
  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <>
      <Meta title="Shopping Cart" />
      <h1>Shopping Cart</h1>
      <Row>
        {/* Cart Items Section */}
        <Col md={8}>
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty 👉 <Link to="/">Go Back</Link>
            </Message>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((item) => (
                <ListGroup.Item className="my-3" key={item._id}>
                  <Row>
                    {/* Product Image */}
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>

                    {/* Product Name */}
                    <Col md={3}>
                      <Link
                        to={`/product/${item._id}`}
                        className="product-title text-dark"
                        style={{ textDecoration: "none" }}
                      >
                        {item.name}
                      </Link>
                    </Col>

                    {/* Product Price */}
                    <Col md={2}>{addCurrency(item.price)}</Col>

                    {/* Quantity Selector */}
                    <Col md={2}>
                      <Form.Control
                        as="select"
                        value={item.qty}
                        onChange={(e) =>
                          addToCartHandler(item, Number(e.target.value))
                        }
                      >
                        {/* Generate quantity options based on stock */}
                        {Array.from({ length: item.countInStock }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>

                    {/* Remove Item Button */}
                    <Col md={2}>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => removeFromCartHandler(item._id)}
                      >
                        <FaTrash style={{ color: "red" }} />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        {/* Order Summary Section */}
        <Col md={4}>
          {cartItems.length > 0 && (
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>
                    Subtotal (
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
                  </h2>
                  <strong>
                    {addCurrency(
                      cartItems.reduce(
                        (acc, item) => acc + item.qty * item.price,
                        0
                      )
                    )}
                  </strong>
                </ListGroup.Item>

                {/* Checkout Button */}
                <ListGroupItem>
                  <Button
                    className="w-100"
                    variant="warning"
                    type="button"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceed To Checkout
                  </Button>
                </ListGroupItem>
              </ListGroup>
            </Card>
          )}
        </Col>
      </Row>
    </>
  );
};

export default CartPage;
