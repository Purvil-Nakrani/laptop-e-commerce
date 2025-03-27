import { PRODUCTS_URL, UPLOAD_URL } from '../constants';
import { apiSlice } from './apiSlice';

// Extending the existing API slice to include product-related endpoints
export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    
    // Query to fetch a list of products with optional filters like limit, skip, and search
    getProducts: builder.query({
      query: ({ limit, skip, search }) => ({
        url: PRODUCTS_URL,
        params: { limit, skip, search } // Passing query parameters
      }),
      providesTags: ['Product'] // Enables caching and automatic updates
    }),

    // Query to fetch top-rated products
    getTopProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/top`
      }),
      providesTags: ['Product']
    }),

    // Query to fetch product details by productId
    getProductDetails: builder.query({
      query: productId => ({
        url: `${PRODUCTS_URL}/${productId}`
      }),
      providesTags: ['Product']
    }),

    // Mutation to create a new product
    createProduct: builder.mutation({
      query: productData => ({
        url: PRODUCTS_URL,
        method: 'POST', // Sending product data via POST request
        body: productData
      }),
      invalidatesTags: ['Product'] // Refresh product list after creation
    }),

    // Mutation to update an existing product
    updateProduct: builder.mutation({
      query: ({ productId, ...productData }) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'PUT', // Updating product details via PUT request
        body: { ...productData }
      }),
      invalidatesTags: ['Product'] // Refresh product details after update
    }),

    // Mutation to delete a product by productId
    deleteProduct: builder.mutation({
      query: productId => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Product'] // Refresh product list after deletion
    }),

    // Mutation to upload a product image
    uploadProductImage: builder.mutation({
      query: data => ({
        url: UPLOAD_URL,
        method: 'POST', // Sending image file via POST request
        body: data
      }),
      invalidatesTags: ['Product'] // Refresh product list after image upload
    }),

    // Mutation to create a product review
    createProductReview: builder.mutation({
      query: ({ productId, ...reviewData }) => ({
        url: `${PRODUCTS_URL}/reviews/${productId}`,
        method: 'POST', // Adding a new review via POST request
        body: { ...reviewData }
      }),
      invalidatesTags: ['Product'] // Refresh product reviews after submission
    })
  })
});

// Exporting hooks for using these queries/mutations in React components
export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  useUpdateProductMutation,
  useCreateProductReviewMutation,
  useGetTopProductsQuery
} = productApiSlice;
