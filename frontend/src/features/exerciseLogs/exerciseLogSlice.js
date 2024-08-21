import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Thunk to fetch exercise logs by workout log ID
export const fetchExerciseLogsByWorkout = createAsyncThunk(
  'exerciseLogs/fetchExerciseLogsByWorkout',
  async (workoutLogID) => {
    const response = await api.get(`/exercise-logs/workout/${workoutLogID}`);
    console.log(workoutLogID);
    return response.data;
  }
);

const exerciseLogSlice = createSlice({
  name: 'exerciseLogs',
  initialState: {
    logs: [],
    status: 'idle', // idle, loading, succeeded, failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExerciseLogsByWorkout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExerciseLogsByWorkout.fulfilled, (state, action) => {
        console.log('Fetched logs:', action.payload);
        state.status = 'succeeded';
        state.logs = action.payload;
      })
      .addCase(fetchExerciseLogsByWorkout.rejected, (state, action) => {
        console.error('Error fetching logs:', action.error.message);
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default exerciseLogSlice.reducer;