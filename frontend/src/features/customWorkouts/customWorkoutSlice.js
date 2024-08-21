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
      });
  },
});

export default customWorkoutSlice.reducer;