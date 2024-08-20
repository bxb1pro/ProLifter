import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunk to fetch all preset workouts
export const fetchPresetWorkouts = createAsyncThunk(
  'presetWorkouts/fetchPresetWorkouts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/preset-workouts');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to fetch preset workouts');
    }
  }
);

const presetWorkoutSlice = createSlice({
  name: 'presetWorkouts',
  initialState: {
    workouts: [],
    status: 'idle', // idle, loading, succeeded, failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPresetWorkouts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPresetWorkouts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.workouts = action.payload;
      })
      .addCase(fetchPresetWorkouts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default presetWorkoutSlice.reducer;