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

// Thunk to start a new workout log
export const startWorkoutLog = createAsyncThunk(
    'workoutLogs/startWorkoutLog',
    async ({ presetWorkoutID, customWorkoutID }, { rejectWithValue }) => {
      try {
        const response = await api.post('/workout-logs/start', { presetWorkoutID, customWorkoutID });
        return response.data;
      } catch (error) {
        console.error('Error starting workout log:', error.response || error.message);
        return rejectWithValue(error.response?.data || 'Failed to start workout log');
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
        })
        .addCase(startWorkoutLog.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.logs.unshift(action.payload); // Add the new workout log to the list
        })
        .addCase(startWorkoutLog.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
    },
  });

export default workoutLogSlice.reducer;