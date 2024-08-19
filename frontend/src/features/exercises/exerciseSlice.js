import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Thunk to fetch all exercises
export const fetchExercises = createAsyncThunk(
    'exercises/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/exercises');
            return response.data;
        } catch (error) {
            console.error('Fetch exercises error:', error.response ? error.response.data : error.message);
            return rejectWithValue(error.response.data || 'Failed to fetch exercises');
        }
    }
);

const exerciseSlice = createSlice({
    name: 'exercises',
    initialState: {
        exercises: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchExercises.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchExercises.fulfilled, (state, action) => {
                state.exercises = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchExercises.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            });
    },
});

export default exerciseSlice.reducer;