import React, { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import Meta from '../components/Meta';

const Payment = () => {
  // Default payment method set to 'Razorpay'
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get shipping address from Redux store
  const { shippingAddress } = useSelector(state => state.cart);

  // Redirect to shipping page if no shipping address is found
  useEffect(() => {
    if (!shippingAddress) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  // Handle form submission
  const submitHandler = e => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod)); // Save selected payment method
    navigate('/place-order'); // Redirect to place order page
  };

  return (
    <FormContainer>
      {/* Checkout Steps Progress */}
      <CheckoutSteps step1 step2 step3 />
      <Meta title="Payment Method" />

      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            {/* Radio button for Razorpay */}
            <Form.Check
              className="my-2"
              type="radio"
              id="Razorpay"
              label="Razorpay"
              name="paymentMethod"
              value="Razorpay"
              checked={paymentMethod === 'Razorpay'}
              onChange={e => setPaymentMethod(e.target.value)}
            />
          </Col>
        </Form.Group>

        {/* Continue Button */}
        <Button className="mb-3 w-100" variant="warning" type="submit">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default Payment;
