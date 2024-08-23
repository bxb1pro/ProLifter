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

// Thunk to edit an exercise log
export const editExerciseLog = createAsyncThunk(
    'exerciseLogs/editExerciseLog',
    async ({ exerciseLogID, exerciseLogCompleted, exerciseLogSets }, { rejectWithValue }) => {
      try {
        const response = await api.put(`/exercise-logs/${exerciseLogID}/edit`, {
          exerciseLogCompleted,
          exerciseLogSets,
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to edit exercise log');
      }
    }
  );

  // Thunk to delete an exercise log
export const deleteExerciseLog = createAsyncThunk(
    'exerciseLogs/deleteExerciseLog',
    async (exerciseLogID, { rejectWithValue }) => {
      try {
        await api.delete(`/exercise-logs/${exerciseLogID}/delete`);
        return exerciseLogID;
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to delete exercise log');
      }
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
          state.status = 'succeeded';
          state.logs = action.payload;
        })
        .addCase(fetchExerciseLogsByWorkout.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(editExerciseLog.fulfilled, (state, action) => {
          const index = state.logs.findIndex(
            (log) => log.exerciseLogID === action.payload.exerciseLogID
          );
          if (index !== -1) {
            state.logs[index] = action.payload;
          }
        })
        .addCase(editExerciseLog.rejected, (state, action) => {
          state.error = action.payload;
        })
        .addCase(deleteExerciseLog.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.logs = state.logs.filter(log => log.exerciseLogID !== action.payload);
        })
        .addCase(deleteExerciseLog.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        });
    },
  });
  
  export default exerciseLogSlice.reducer;