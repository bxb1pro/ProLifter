import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

// Thunk to log user in
export const loginUser = createAsyncThunk(
    'auth/login',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', userData);
            console.log('Login successful, response:', response.data); // Add this line
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message); // Add this line
            return rejectWithValue(error.response.data || 'Login failed');
        }
    }
);

// Thunk to sign up user
export const signupUser = createAsyncThunk(
    'auth/signup',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/signup', userData);
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            console.error('Signup error:', error.response ? error.response.data : error.message);
            return rejectWithValue(error.response.data || 'Signup failed');
        }
    }
);

// Thunk to fetch account details
export const fetchAccountDetails = createAsyncThunk(
    'auth/fetchAccountDetails',
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.get('/auth/account');
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data || 'Failed to fetch account details');
      }
    }
  );
  
  // Thunk to delete account
  export const deleteAccount = createAsyncThunk(
    'auth/deleteAccount',
    async (userPassword, { rejectWithValue }) => {
      try {
        const response = await api.delete('/auth/delete', { data: { userPassword } });
        localStorage.removeItem('token');
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data || 'Failed to delete account');
      }
    }
  );
  
  const authSlice = createSlice({
    name: 'auth',
    initialState: {
      user: null,
      token: localStorage.getItem('token') || null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    },
    reducers: {
      logout(state) {
        localStorage.removeItem('token');
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      },
      clearErrors(state) {
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(signupUser.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(signupUser.fulfilled, (state, action) => {
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;
        })
        .addCase(signupUser.rejected, (state, action) => {
          state.error = action.payload;
          state.isLoading = false;
        })
        .addCase(loginUser.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.error = action.payload;
          state.isLoading = false;
        })
        .addCase(fetchAccountDetails.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(fetchAccountDetails.fulfilled, (state, action) => {
          state.user = action.payload;
          state.isLoading = false;
          state.error = null;
        })
        .addCase(fetchAccountDetails.rejected, (state, action) => {
          state.error = action.payload;
          state.isLoading = false;
        })
        .addCase(deleteAccount.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(deleteAccount.fulfilled, (state) => {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.isLoading = false;
          state.error = null;
        })
        .addCase(deleteAccount.rejected, (state, action) => {
          state.error = action.payload;
          state.isLoading = false;
        });
    },
  });
  
  export const { logout, clearErrors } = authSlice.actions;
  export default authSlice.reducer;