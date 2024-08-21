// src/features/presetWorkouts/presetWorkoutSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Thunk to fetch all preset workouts
export const fetchPresetWorkouts = createAsyncThunk(
  'presetWorkouts/fetchPresetWorkouts',
  async () => {
    const response = await api.get('/preset-workouts');
    return response.data;
  }
);

// Thunk to link an exercise to a preset workout
export const linkExerciseToPresetWorkout = createAsyncThunk(
  'presetWorkouts/linkExerciseToPresetWorkout',
  async ({ presetWorkoutID, exerciseID }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/preset-workout-exercises/${presetWorkoutID}/link-exercise`, { exerciseID });
      return response.data;
    } catch (error) {
      console.error('Link exercise to preset workout error:', error.response ? error.response.data : error.message);
      return rejectWithValue(error.response.data || 'Failed to link exercise');
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
        state.error = action.error.message;
      })
      .addCase(linkExerciseToPresetWorkout.fulfilled, (state, action) => {
        state.status = 'succeeded';  // Handle successful linking if needed
      })
      .addCase(linkExerciseToPresetWorkout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default presetWorkoutSlice.reducer;