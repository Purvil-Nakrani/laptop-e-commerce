import { USERS_URL } from '../constants';
import { apiSlice } from './apiSlice';

// Inject user-related endpoints into the API slice
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    
    // Login mutation: Sends user credentials to authenticate
    login: builder.mutation({
      query: data => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['User'] // Invalidates cache for user-related data
    }),

    // Logout mutation: Logs out the user
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST'
      }),
      invalidatesTags: ['User']
    }),

    // Register mutation: Registers a new user
    register: builder.mutation({
      query: data => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['User']
    }),

    // Password reset request mutation: Sends an email to reset the password
    newPasswordRequest: builder.mutation({
      query: data => ({
        url: `${USERS_URL}/reset-password/request`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['User']
    }),

    // Password reset mutation: Resets the password using a token
    resetPassword: builder.mutation({
      query: ({ userId, token, password }) => ({
        url: `${USERS_URL}/reset-password/reset/${userId}/${token}`,
        method: 'POST',
        body: { password }
      }),
      invalidatesTags: ['User']
    }),

    // Update user profile mutation: Updates the logged-in user's profile
    profile: builder.mutation({
      query: data => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['User']
    }),

    // Fetch user profile query: Retrieves the logged-in user's profile
    getUserProfile: builder.query({
      query: async () => ({
        url: `${USERS_URL}/profile`
      }),
      providesTags: ['User']
    }),

    // Fetch all users query: Retrieves the list of all users
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL
      }),
      providesTags: ['User']
    }),

    // Fetch admin users query: Retrieves the list of admin users
    admins: builder.query({
      query: () => ({
        url: `${USERS_URL}/admins`
      }),
      providesTags: ['User']
    }),

    // Fetch user by ID query: Retrieves user details by ID
    getUserById: builder.query({
      query: userId => ({
        url: `${USERS_URL}/${userId}`
      }),
      providesTags: ['User']
    }),

    // Delete user mutation: Deletes a user by ID
    deleteUser: builder.mutation({
      query: userId => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['User']
    }),

    // Update user mutation: Updates user details by ID
    updateUser: builder.mutation({
      query: ({ userId, ...userData }) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'PUT',
        body: { ...userData }
      }),
      invalidatesTags: ['User']
    })
  })
});

// Export hooks for API calls to be used in components
export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useNewPasswordRequestMutation,
  useResetPasswordMutation,
  useProfileMutation,
  useGetUserProfileQuery,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserByIdQuery,
  useAdminsQuery
} = usersApiSlice;
