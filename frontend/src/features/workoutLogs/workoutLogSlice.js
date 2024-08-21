import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Thunk to fetch workout logs for the current user
export const fetchUserWorkoutLogs = createAsyncThunk(
  'workoutLogs/fetchUserWorkoutLogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/workout-logs');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to fetch workout logs');
    }
  }
);

const workoutLogSlice = createSlice({
  name: 'workoutLogs',
  initialState: {
    logs: [],
    status: 'idle', // idle, loading, succeeded, failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserWorkoutLogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserWorkoutLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.logs = action.payload;
      })
      .addCase(fetchUserWorkoutLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default workoutLogSlice.reducer;