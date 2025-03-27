import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addCurrency } from '../utils/addCurrency';
import { addToCart } from '../slices/cartSlice';
import Rating from './Rating';

const Product = ({ product }) => {
  // Manage quantity state for adding to cart
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to handle adding a product to the cart
  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart'); // Redirect to the cart page after adding item
  };

  return (
    <Card className='my-3 p-3 rounded shadow-sm border-0 text-center'>
      {/* Product Image & Details Link */}
      <Link
        to={`/product/${product._id}`}
        className='text-dark text-decoration-none'
      >
        <Card.Img
          variant='top'
          src={product.image}
          className='img-fluid p-2'
          style={{ height: '200px', objectFit: 'contain' }}
        />
        <Card.Body>
          {/* Product Name */}
          <Card.Title as='div' className='fw-bold product-title'>
            {product.name}
          </Card.Title>

          {/* Rating Component */}
          <Card.Text as='div' className='mb-2 text-muted'>
            <Rating
              value={product.rating}
              text={`(${product.numReviews} reviews)`}
            />
          </Card.Text>

          {/* Product Price with Currency Format */}
          <Card.Text as='h4' className='fw-bold text-success'>
            {addCurrency(product.price)}
          </Card.Text>
        </Card.Body>
      </Link>

      {/* Add to Cart Button */}
      <Button
        variant='warning'
        type='button'
        className='w-100 fw-bold'
        disabled={product.countInStock === 0}
        onClick={addToCartHandler}
      >
        {product.countInStock > 0 ? 'Add To Cart' : 'Out of Stock'}
      </Button>
    </Card>
  );
};

export default Product;
