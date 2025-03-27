import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaSearch, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { toast } from 'react-toastify';

const Header = () => {
  const { cartItems } = useSelector(state => state.cart);
  const { userInfo } = useSelector(state => state.auth);
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
      toast.success('Logout successful');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect className='fixed-top shadow-lg py-3'>
      <Container>
        {/* Brand Logo */}
        <LinkContainer to='/'>
          <Navbar.Brand className="fw-bold text-warning fs-4">🛒 MERN Shop</Navbar.Brand>
        </LinkContainer>

        {/* Navbar Toggle for Mobile */}
        <Navbar.Toggle aria-controls='basic-navbar-nav' />

        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className="w-100 d-flex flex-column flex-lg-row align-items-center">

            {/* Search Bar in Center with Full Width */}
            <Form className="d-flex mx-auto w-100" style={{ maxWidth: '600px' }}>
              <FormControl type="text" placeholder="Search products..." className="me-2" />
              <Button variant="warning">
                <FaSearch />
              </Button>
            </Form>

            {/* Cart Icon */}
            <LinkContainer to='/cart'>
              <Nav.Link className="text-light position-relative mx-3">
                <FaShoppingCart className="me-1" />
                Cart
                {cartItems.length > 0 && (
                  <Badge pill bg='warning' className='text-dark position-absolute top-0 start-100 translate-middle'>
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  </Badge>
                )}
              </Nav.Link>
            </LinkContainer>

            {/* User Dropdown */}
            {userInfo ? (
              <NavDropdown 
                title={<span className="text-light"><FaUserCircle className="me-1" /> {userInfo.name}</span>}
                id='username'
                className="custom-dropdown mx-3"
              >
                <LinkContainer to='/profile'>
                  <NavDropdown.Item>
                    <FaUser className="me-2" /> Profile
                  </NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Item onClick={logoutHandler}>
                  <FaSignOutAlt className="me-2 text-danger" /> Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <LinkContainer to='/login'>
                <Nav.Link className="text-light mx-3">
                  <FaUser className="me-1" />
                  Sign In
                </Nav.Link>
              </LinkContainer>
            )}

            {/* Admin Panel (Only for Admins) */}
            {userInfo && userInfo.isAdmin && (
              <NavDropdown title='Admin Panel' id='adminmenu' className="custom-dropdown mx-3">
                <LinkContainer to='/admin/product-list'>
                  <NavDropdown.Item>🛍️ Products</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/admin/order-list'>
                  <NavDropdown.Item>📦 Orders</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/admin/user-list'>
                  <NavDropdown.Item>👥 Users</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
