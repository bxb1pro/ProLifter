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

// Thunk to fetch workout log details
export const fetchWorkoutLogDetails = createAsyncThunk(
  'workoutLogs/fetchWorkoutLogDetails',
  async (workoutLogID, { rejectWithValue }) => {
    try {
      const response = await api.get(`/workout-logs/${workoutLogID}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to fetch workout log details');
    }
  }
);

// Thunk to finish a workout log
export const finishWorkoutLog = createAsyncThunk(
  'workoutLogs/finishWorkoutLog',
  async (workoutLogID, { rejectWithValue }) => {
    try {
      const response = await api.put(`/workout-logs/${workoutLogID}/finish`);
      return response.data;
    } catch (error) {
      console.error('Error finishing workout log:', error.response || error.message);
      return rejectWithValue(error.response?.data || 'Failed to finish workout log');
    }
  }
);

// Thunk to delete a workout log
export const deleteWorkoutLog = createAsyncThunk(
  'workoutLogs/deleteWorkoutLog',
  async (workoutLogID, { rejectWithValue }) => {
    try {
      await api.delete(`/workout-logs/${workoutLogID}/delete`);
      return workoutLogID;
    } catch (error) {
      console.error('Error deleting workout log:', error.response || error.message);
      return rejectWithValue(error.response?.data || 'Failed to delete workout log');
    }
  }
);

const workoutLogSlice = createSlice({
  name: 'workoutLogs',
  initialState: {
    logs: [],
    currentLog: null,
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
      })
      .addCase(fetchWorkoutLogDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWorkoutLogDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentLog = action.payload;
      })
      .addCase(fetchWorkoutLogDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(finishWorkoutLog.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.logs.findIndex(log => log.workoutLogID === action.payload.workoutLogID);
        if (index !== -1) {
          state.logs[index] = action.payload;
        }
        if (state.currentLog?.workoutLogID === action.payload.workoutLogID) {
          state.currentLog = action.payload;
        }
      })
      .addCase(finishWorkoutLog.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteWorkoutLog.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.logs = state.logs.filter(log => log.workoutLogID !== action.payload);
      })
      .addCase(deleteWorkoutLog.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default workoutLogSlice.reducer;