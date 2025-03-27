import { createSlice } from '@reduxjs/toolkit';

// Initial state for authentication
const initialState = {
  // Retrieve user info from localStorage if available; otherwise, set it to null
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null
};

// Creating an authentication slice using Redux Toolkit
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set user credentials after login/register
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      // Store user info in localStorage to persist authentication state
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    
    // Action to log the user out
    logout: (state, action) => {
      state.userInfo = null;
      // Remove user info from localStorage on logout
      localStorage.removeItem('userInfo');
    }
  }
});

// Exporting actions for use in components
export const { setCredentials, logout } = authSlice.actions;

// Exporting reducer to be added to the store
export default authSlice.reducer;
