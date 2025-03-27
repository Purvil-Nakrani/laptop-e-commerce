import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

// Initial state for the cart, retrieved from localStorage if available
const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'Razorpay' };

// Creating a cart slice using Redux Toolkit
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Action to add an item to the cart
    addToCart: (state, action) => {
      const item = action.payload;
      // Check if the item already exists in the cart
      const existItem = state.cartItems.find(x => x._id === item._id);

      if (existItem) {
        // If item exists, replace it with the new one (update quantity/details)
        state.cartItems = state.cartItems.map(x =>
          x._id === existItem._id ? item : x
        );
      } else {
        // If item doesn't exist, add it to the cart
        state.cartItems = [...state.cartItems, item];
      }

      // Update localStorage and return the updated cart state
      return updateCart(state);
    },

    // Action to remove an item from the cart
    removeFromCart: (state, action) => {
      const id = action.payload;
      // Remove the item from the cart using filter
      state.cartItems = state.cartItems.filter(x => x._id !== id);

      // Update localStorage and return the updated cart state
      return updateCart(state);
    },

    // Action to save the shipping address in the cart state
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },

    // Action to save the payment method in the cart state
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },

    // Action to clear all items from the cart
    clearCartItems: (state, action) => {
      state.cartItems = [];
      return updateCart(state);
    }
  }
});

// Exporting actions for use in components
export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems
} = cartSlice.actions;

// Exporting reducer to be added to the store
export default cartSlice.reducer;
