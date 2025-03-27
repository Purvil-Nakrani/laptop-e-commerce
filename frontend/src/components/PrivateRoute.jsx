import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  // Get user authentication info from Redux store
  const { userInfo } = useSelector(state => state.auth);

  // If user is logged in, render the requested component (Outlet)
  // Otherwise, redirect to the login page
  return userInfo ? <Outlet /> : <Navigate to='/login' replace />;
};

export default PrivateRoute;
