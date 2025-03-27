import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import Meta from '../components/Meta';

const ShippingPage = () => {
  // Get shipping address from Redux store
  const { shippingAddress } = useSelector(state => state.cart);

  // State variables for shipping form inputs
  const [formData, setFormData] = useState({
    address: shippingAddress.address || '',
    city: shippingAddress.city || '',
    postalCode: shippingAddress.postalCode || '',
    country: shippingAddress.country || ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle input changes dynamically
  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const submitHandler = e => {
    e.preventDefault();
    dispatch(saveShippingAddress(formData));
    navigate('/payment'); // Redirect to payment page
  };

  return (
    <FormContainer>
      {/* Step indicators for checkout process */}
      <CheckoutSteps step1 step2 />
      <Meta title="Shipping" />
      <h1>Shipping</h1>

      <Form onSubmit={submitHandler}>
        {/* Address Input */}
        <Form.Group className="mb-3" controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={formData.address}
            placeholder="Enter your address"
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        {/* City Input */}
        <Form.Group className="mb-3" controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            name="city"
            value={formData.city}
            placeholder="Enter your city"
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        {/* Postal Code Input */}
        <Form.Group className="mb-3" controlId="postalCode">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type="text"
            name="postalCode"
            value={formData.postalCode}
            placeholder="Enter postal code"
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        {/* Country Input */}
        <Form.Group className="mb-3" controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            name="country"
            value={formData.country}
            placeholder="Enter your country"
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        {/* Continue Button */}
        <Button className="mb-3 w-100" variant="warning" type="submit">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingPage;
