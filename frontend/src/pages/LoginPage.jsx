import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Meta from "../components/Meta";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get("redirect") || "/";

  // Form state (grouped for better structure)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
    showPassword: false,
  });

  const { email, password, remember, showPassword } = formData;

  // Redux state for authentication
  const { userInfo } = useSelector((state) => state.auth);

  // API login mutation
  const [login, { isLoading }] = useLoginMutation();

  // Redirect user if already logged in
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  // Handles input changes
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setFormData((prevData) => ({
      ...prevData,
      showPassword: !prevData.showPassword,
    }));
  };

  // Handles login form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password, remember }).unwrap();
      dispatch(setCredentials(res)); // Save user credentials in Redux
      toast.success("Login successful");
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <FormContainer>
      <Meta title="Sign In" />
      <h1>Sign In</h1>

      <Form onSubmit={submitHandler}>
        {/* Email Input */}
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            value={email}
            placeholder="Enter email"
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Password Input with Toggle Visibility */}
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Enter password"
              onChange={handleChange}
              required
            />
            <Button variant="light" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </InputGroup>
        </Form.Group>

        {/* Remember Me Checkbox */}
        <Form.Group className="mb-3" controlId="remember">
          <Form.Check
            type="checkbox"
            label="Keep me signed in"
            checked={remember}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Submit Button */}
        <Button className="mb-3 w-100" variant="warning" type="submit" disabled={isLoading}>
          {isLoading ? <Loader /> : "Sign In"}
        </Button>
      </Form>

      {/* Register Link */}
      <Row>
        <Col>
          New Customer?
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"} className="mx-2">
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginPage;
