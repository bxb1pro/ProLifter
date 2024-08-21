import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Thunk to fetch custom workouts for the logged-in user
export const fetchUserCustomWorkouts = createAsyncThunk(
  'customWorkouts/fetchUserCustomWorkouts',
  async () => {
    const response = await api.get('/custom-workouts');
    return response.data;
  }
);

// Thunk to link an exercise to a custom workout
export const linkExerciseToCustomWorkout = createAsyncThunk(
  'customWorkouts/linkExerciseToCustomWorkout',
  async ({ customWorkoutID, exerciseID }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/custom-workout-exercises/${customWorkoutID}/link-exercise`, { exerciseID });
      return response.data;
    } catch (error) {
      console.error('Link exercise to custom workout error:', error.response ? error.response.data : error.message);
      return rejectWithValue(error.response.data || 'Failed to link exercise');
    }
  }
);

const customWorkoutSlice = createSlice({
  name: 'customWorkouts',
  initialState: {
    workouts: [],
    status: 'idle', // idle, loading, succeeded, failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCustomWorkouts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserCustomWorkouts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.workouts = action.payload;
      })
      .addCase(fetchUserCustomWorkouts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(linkExerciseToCustomWorkout.fulfilled, (state, action) => {
        state.status = 'succeeded';  // Handle successful linking if needed
      })
      .addCase(linkExerciseToCustomWorkout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default customWorkoutSlice.reducer;