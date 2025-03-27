import { createSlice } from '@reduxjs/toolkit';

// Define the initial state for search functionality
const initialState = {
  search: '' // Stores the search query
};

// Create a slice of state for handling product search
export const searchProductSlice = createSlice({
  name: 'products', // Slice name
  initialState,
  reducers: {
    
    // Action to update the search query in the state
    searchProduct: (state, action) => {
      state.search = action.payload;
    },

    // Action to clear the search query
    clearSearch: state => {
      state.search = ''; // Resets the search field to an empty string
    }
  }
});

// Export action creators for use in components
export const { searchProduct, clearSearch } = searchProductSlice.actions;

// Export reducer to be used in the store configuration
export default searchProductSlice.reducer;
