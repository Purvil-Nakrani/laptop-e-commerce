import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';
import { addCurrency } from '../utils/addCurrency';
import Loader from './Loader';
import Message from './Message';

const ProductCarousel = () => {
  // Fetch top-rated products using the API slice
  const { data: products } = useGetTopProductsQuery();

  return (
    <Carousel fade className='text-center bg-secondary mb-5 z-0'>
      {/* Loop through each top product and display in carousel */}
      {products?.map(product => (
        <Carousel.Item key={product._id} interval={3000}>
          {/* Link to product details page */}
          <Link to={`/product/${product._id}`}>
            {/* Product Image */}
            <Image
              src={product.image}
              alt={product.name}
              fluid
              style={{ height: '500px' }}
            />
            {/* Product Name & Price */}
            <Carousel.Caption className='pb-5 px-5'>
              <h3 className='product-title'>{product.name}</h3>
              <h1>{addCurrency(product.price)}</h1>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
