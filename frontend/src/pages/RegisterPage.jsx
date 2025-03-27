import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Meta from '../components/Meta';

const RegisterPage = () => {
  // State variables for form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State variables for password visibility toggling
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // API mutation for registering a user
  const [register, { isLoading }] = useRegisterMutation();

  // Get user info from Redux state
  const { userInfo } = useSelector(state => state.auth);

  // Get redirect parameter from URL query
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get('redirect') || '/';

  // Redirect to homepage if already logged in
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

  // Handle form submission
  const submitHandler = async e => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      // Register user API call
      const res = await register({ name, email, password }).unwrap();
      
      // Save user data to Redux store
      dispatch(setCredentials({ ...res }));

      // Redirect after successful registration
      navigate(redirect);
      toast.success('Registration successful. Welcome!');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <FormContainer>
      <Meta title="Register" />
      <h1>Register</h1>

      <Form onSubmit={submitHandler}>
        {/* Name Input */}
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            placeholder="Enter name"
            onChange={e => setName(e.target.value)}
          />
        </Form.Group>

        {/* Email Input */}
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            value={email}
            placeholder="Enter email"
            onChange={e => setEmail(e.target.value)}
          />
        </Form.Group>

        {/* Password Input */}
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              value={password}
              placeholder="Enter password"
              onChange={e => setPassword(e.target.value)}
            />
            <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>

        {/* Confirm Password Input */}
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              placeholder="Confirm password"
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <InputGroup.Text onClick={toggleConfirmPasswordVisibility} style={{ cursor: 'pointer' }}>
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>

        {/* Register Button */}
        <Button className="mb-3 w-100" variant="warning" type="submit" disabled={isLoading}>
          Register
        </Button>
      </Form>

      {/* Redirect to Login if already have an account */}
      <Row>
        <Col>
          Already have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="mx-2">
            Sign In
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterPage;
