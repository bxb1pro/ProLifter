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
      });
  },
});

export default setLogSlice.reducer;