import React from 'react';
import { Row, Col, Button, Table } from 'react-bootstrap';
import { FaCheck, FaXmark, FaIndianRupeeSign } from 'react-icons/fa6';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import ProfileForm from '../components/ProfileForm';
import { addCurrency } from '../utils/addCurrency';

const ProfilePage = () => {
  // Fetch user orders using API query
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <>
      <Row>
        {/* Left Column: Profile Section */}
        <Col md={3}>
          <Meta title="User Profile" />
          <h2>My Profile</h2>
          <ProfileForm />
        </Col>

        {/* Right Column: Orders List */}
        <Col md={9}>
          <h2>My Orders</h2>

          {/* Show Loader while fetching data */}
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error?.data?.message || error.error}</Message>
          ) : (
            <Table striped hover responsive size="sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th>DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{addCurrency(order.totalPrice)}</td>
                    
                    {/* Payment Status */}
                    <td>
                      {order.isPaid ? (
                        <FaCheck style={{ color: 'green' }} />
                      ) : (
                        <FaXmark style={{ color: 'red' }} />
                      )}
                    </td>

                    {/* Delivery Status */}
                    <td>
                      {order.isDelivered ? (
                        <FaCheck style={{ color: 'green' }} />
                      ) : (
                        <FaXmark style={{ color: 'red' }} />
                      )}
                    </td>

                    {/* Order Details Button */}
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button className="btn-sm" variant="info">
                          Details
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </>
  );
};

export default ProfilePage;
