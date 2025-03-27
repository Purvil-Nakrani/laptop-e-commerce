import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, ListGroup, Button, Image, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import axios from 'axios';

// Import API hooks
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useUpdateDeliverMutation,
  useGetRazorpayApiKeyQuery,
} from '../slices/ordersApiSlice';

// Import components
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addCurrency } from '../utils/addCurrency';

const OrderDetailsPage = () => {
  const { id: orderId } = useParams();
  
  // Fetch order details
  const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const { userInfo } = useSelector(state => state.auth);
  const { data: razorpayApiKey } = useGetRazorpayApiKeyQuery();

  // API Mutations
  const [payOrder, { isLoading: isPayOrderLoading }] = usePayOrderMutation();
  const [updateDeliver, { isLoading: isUpdateDeliverLoading }] = useUpdateDeliverMutation();

  // Handle payment using Razorpay
  const paymentHandler = async () => {
    try {
      const razorpayData = {
        amount: order.totalPrice * 100, // Convert to paisa (smallest unit)
        currency: 'INR',
        receipt: `receipt#${orderId}`,
      };
      
      // Create order on backend
      const { data } = await axios.post('/api/v1/payment/razorpay/order', razorpayData);
      const { id: razorpayOrderId } = data;

      // Razorpay payment options
      const options = {
        key: razorpayApiKey.razorpayKeyId,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
        name: 'MERN Shop',
        description: 'Order Payment',
        order_id: razorpayOrderId,
        handler: async response => {
          try {
            const { data } = await axios.post('/api/v1/payment/razorpay/order/validate', response);
            const details = { ...data, email: order?.user?.email };
            await payOrder({ orderId, details });
            toast.success(data.message);
          } catch (error) {
            toast.error(error?.data?.message || error.error);
          }
        },
        prefill: {
          name: order?.user?.name,
          email: order?.user?.email,
        },
        notes: { address: 'MERN Shop Office' },
        theme: { color: '#FFC107' },
      };
      
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  // Mark order as delivered
  const deliveredHandler = async () => {
    try {
      await updateDeliver(orderId);
      toast.success('Order Delivered');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Meta title='Order Details' />
          <h1>Order ID: {orderId}</h1>
          <Row>
            <Col md={8}>
              <ListGroup variant='flush'>
                {/* Shipping Information */}
                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p><strong>Name:</strong> {order?.user?.name}</p>
                  <p><strong>Email:</strong> {order?.user?.email}</p>
                  <p><strong>Address:</strong> {order?.shippingAddress?.address}, {order?.shippingAddress?.city}, {order?.shippingAddress?.postalCode}, {order?.shippingAddress?.country}</p>
                  {order?.isDelivered ? (
                    <Message variant='success'>Delivered on {new Date(order?.deliveredAt).toLocaleString()}</Message>
                  ) : (
                    <Message variant='danger'>Not Delivered</Message>
                  )}
                </ListGroup.Item>
                
                {/* Payment Information */}
                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <p><strong>Method:</strong> {order?.paymentMethod}</p>
                  {order?.isPaid ? (
                    <Message variant='success'>Paid on {new Date(order?.paidAt).toLocaleString()}</Message>
                  ) : (
                    <Message variant='danger'>Not Paid</Message>
                  )}
                </ListGroup.Item>
                
                {/* Order Items */}
                <ListGroup.Item>
                  <h2>Order Items</h2>
                  {order?.orderItems?.map(item => (
                    <ListGroup.Item key={item._id}>
                      <Row>
                        <Col md={2}><Image src={item.image} alt={item.name} fluid rounded /></Col>
                        <Col md={6}><Link to={`/product/${item._id}`} className='text-dark'>{item.name}</Link></Col>
                        <Col md={4}>{item.qty} x {addCurrency(item.price)} = {addCurrency(item.qty * item.price)}</Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            {/* Order Summary */}
            <Col md={4}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item><h2>Order Summary</h2></ListGroup.Item>
                  <ListGroup.Item><Row><Col>Items:</Col><Col>{addCurrency(order?.itemsPrice)}</Col></Row></ListGroup.Item>
                  <ListGroup.Item><Row><Col>Shipping:</Col><Col>{addCurrency(order?.shippingPrice)}</Col></Row></ListGroup.Item>
                  <ListGroup.Item><Row><Col>Tax:</Col><Col>{addCurrency(order?.taxPrice)}</Col></Row></ListGroup.Item>
                  <ListGroup.Item><Row><Col>Total:</Col><Col>{addCurrency(order?.totalPrice)}</Col></Row></ListGroup.Item>

                  {/* Payment Button */}
                  {!order?.isPaid && !userInfo.isAdmin && (
                    <ListGroup.Item><Button className='w-100' variant='warning' onClick={paymentHandler} disabled={isPayOrderLoading}>Pay Order</Button></ListGroup.Item>
                  )}

                  {/* Mark as Delivered Button */}
                  {userInfo?.isAdmin && order?.isPaid && !order?.isDelivered && (
                    <ListGroup.Item><Button variant='warning' onClick={deliveredHandler} disabled={isUpdateDeliverLoading}>Mark As Delivered</Button></ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default OrderDetailsPage;