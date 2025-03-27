import React from 'react';
import { Outlet, Navigate } from 'react-router-dom'; 
import { useSelector } from 'react-redux'; 

const AdminRoute = () => {
  // Accessing the authentication state from Redux store
  const { userInfo } = useSelector(state => state.auth);

  // Check if the user is logged in and is an admin
  return userInfo && userInfo.isAdmin ? (
    // If user is an admin, allow access to the requested route
    <Outlet />
  ) : (
    // If not an admin, redirect to the admin login page
    <Navigate to='/admin/login' replace />
  );
};

export default AdminRoute;
