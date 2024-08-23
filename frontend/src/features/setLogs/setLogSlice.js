// src/features/setLogs/setLogSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Thunk to fetch set logs by exercise log ID
export const fetchSetLogsByExercise = createAsyncThunk(
  'setLogs/fetchSetLogsByExercise',
  async (exerciseLogID) => {
    const response = await api.get(`/set-logs/exercise/${exerciseLogID}`);
    return response.data;
  }
);

// Thunk to add a new set log
export const addSetLog = createAsyncThunk(
    'setLogs/addSetLog',
    async (setLogData, { rejectWithValue }) => {
      try {
        const response = await api.post('/set-logs', setLogData);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data || 'Failed to add set log');
      }
    }
  );
// Thunk to delete a set log
  export const deleteSetLog = createAsyncThunk(
    'setLogs/deleteSetLog',
    async (setLogID, { rejectWithValue }) => {
      try {
        console.log("Deleting set log with ID:", setLogID); // Ensure this is not undefined
        await api.delete(`/set-logs/${setLogID}/delete`);
        return setLogID;
      } catch (error) {
        return rejectWithValue(error.response.data || 'Failed to delete set log');
      }
    }
  );

// Thunk to edit a set log
export const editSetLog = createAsyncThunk(
    'setLogs/editSetLog',
    async ({ id, setLogWeight, setLogReps, setLogRPE, setLog1RM }, { rejectWithValue }) => {
      try {
        const response = await api.put(`/set-logs/${id}/edit`, {
          setLogWeight,
          setLogReps,
          setLogRPE,
          setLog1RM
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data || 'Failed to edit set log');
      }
    }
  );


  const setLogSlice = createSlice({
    name: 'setLogs',
    initialState: {
      logs: [],
      status: 'idle', // idle, loading, succeeded, failed
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchSetLogsByExercise.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchSetLogsByExercise.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.logs = action.payload;
        })
        .addCase(fetchSetLogsByExercise.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(addSetLog.fulfilled, (state, action) => {
          state.logs.push(action.payload); // Add the new set log to the list
          state.status = 'succeeded';
        })
        .addCase(addSetLog.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
        .addCase(deleteSetLog.fulfilled, (state, action) => {
          state.logs = state.logs.filter(log => log.setLogID !== action.payload); // Remove the deleted set log from the list
          state.status = 'succeeded';
        })
        .addCase(deleteSetLog.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
        .addCase(editSetLog.fulfilled, (state, action) => {
            const index = state.logs.findIndex(log => log.setLogID === action.payload.setLogID);
            if (index !== -1) {
              state.logs[index] = action.payload;
            }
        })
        .addCase(editSetLog.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        });
    },
  });
  
  export default setLogSlice.reducer;