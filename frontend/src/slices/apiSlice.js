import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';

// Creating an API slice using Redux Toolkit Query
export const apiSlice = createApi({
  // Define the base query with the API's base URL
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),

  // Define tag types to enable caching & automatic refetching of related data
  tagTypes: ['User', 'Product', 'Order'],

  // Define endpoints (empty for now, will be extended in other slices)
  endpoints: builder => ({})
});
