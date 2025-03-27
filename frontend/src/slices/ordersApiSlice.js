import { ORDERS_URL, RAZORPAY_URL } from '../constants';
import { apiSlice } from './apiSlice';

// Extending the existing API slice to include order-related endpoints
export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Mutation to create a new order
    createOrder: builder.mutation({
      query: order => ({
        url: ORDERS_URL,
        method: 'POST', // Sending order data via POST request
        body: { ...order }
      }),
      invalidatesTags: ['Order'] // Invalidate cache to refresh order data
    }),

    // Query to fetch order details by orderId
    getOrderDetails: builder.query({
      query: orderId => ({
        url: `${ORDERS_URL}/${orderId}`
      }),
      providesTags: ['Order'] // Caching mechanism for order details
    }),

    // Query to fetch all orders for the logged-in user
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/my-orders`
      }),
      providesTags: ['Order']
    }),

    // Mutation to handle order payment
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT', // Update the order with payment details
        body: { ...details }
      }),
      invalidatesTags: ['Order'] // Refresh order data after payment
    }),

    // Mutation to update order delivery status
    updateDeliver: builder.mutation({
      query: orderId => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT' // Mark the order as delivered
      }),
      invalidatesTags: ['Order'] // Refresh order data
    }),

    // Query to get Razorpay API key for payment integration
    getRazorpayApiKey: builder.query({
      query: () => ({
        url: `${RAZORPAY_URL}/razorpay/config`
      }),
      providesTags: ['Order']
    }),

    // Query to fetch all orders (for admin panel or order management)
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL
      }),
      providesTags: ['Order']
    })
  })
});

// Exporting hooks for using these queries/mutations in React components
export const {
  useGetOrderDetailsQuery,
  useCreateOrderMutation,
  usePayOrderMutation,
  useUpdateDeliverMutation,
  useGetRazorpayApiKeyQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery
} = ordersApiSlice;
