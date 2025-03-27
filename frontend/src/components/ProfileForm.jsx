import React, { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useProfileMutation } from '../slices/usersApiSlice';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Loader from './Loader';

const ProfileForm = () => {
  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

  const { userInfo } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  // API call to update profile
  const [updateProfile, { isLoading: isUpdateProfileLoading }] = useProfileMutation();

  // Toggle visibility for password field
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // Toggle visibility for confirm password field
  const toggleConfirmPasswordVisibility = () => {
    setConfirmShowPassword(prev => !prev);
  };

  // Form submission handler
  const submitHandler = async e => {
    e.preventDefault();

    // Validate passwords match
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match!');
    }

    try {
      // Update user profile
      const res = await updateProfile({ name, email, password }).unwrap();

      // Dispatch updated credentials
      dispatch(setCredentials({ ...res }));

      // Reset form fields
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      toast.success(res.message);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <Form onSubmit={submitHandler} className="p-3 border rounded bg-light shadow">
      {/* Name Field */}
      <Form.Group className='mb-3' controlId='name'>
        <Form.Label>Name</Form.Label>
        <Form.Control
          value={name}
          type='text'
          placeholder='Enter name'
          onChange={e => setName(e.target.value)}
          required
        />
      </Form.Group>

      {/* Email Field */}
      <Form.Group className='mb-3' controlId='email'>
        <Form.Label>Email address</Form.Label>
        <Form.Control
          value={email}
          type='email'
          placeholder='Enter email'
          onChange={e => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      {/* Password Field */}
      <Form.Group className='mb-3' controlId='password'>
        <Form.Label>Password</Form.Label>
        <InputGroup>
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            value={password}
            placeholder='Enter password'
            onChange={e => setPassword(e.target.value)}
          />
          {/* Toggle Button for Password Visibility */}
          <InputGroup.Text
            onClick={togglePasswordVisibility}
            className="bg-white border"
            style={{ cursor: 'pointer' }}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </InputGroup.Text>
        </InputGroup>
      </Form.Group>

      {/* Confirm Password Field */}
      <Form.Group className='mb-3' controlId='confirmPassword'>
        <Form.Label>Confirm Password</Form.Label>
        <InputGroup>
          <Form.Control
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            placeholder='Confirm password'
            onChange={e => setConfirmPassword(e.target.value)}
          />
          {/* Toggle Button for Confirm Password Visibility */}
          <InputGroup.Text
            onClick={toggleConfirmPasswordVisibility}
            className="bg-white border"
            style={{ cursor: 'pointer' }}
          >
            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
          </InputGroup.Text>
        </InputGroup>
      </Form.Group>

      {/* Submit Button */}
      <Button className='mb-3 w-100' variant='warning' type='submit' disabled={isUpdateProfileLoading}>
        Update Profile
      </Button>

      {/* Show Loader While Updating */}
      {isUpdateProfileLoading && <Loader />}
    </Form>
  );
};

export default ProfileForm;
