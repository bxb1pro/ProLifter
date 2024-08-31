import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Function to capitalise exercise words from API (in slice to avoid repetition in components)
const capitaliseWords = (str) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
};

// Thunk to fetch all exercises
export const fetchExercises = createAsyncThunk(
    'exercises/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/exercises');
            // Capitalize the necessary fields in each exercise
            const exercises = response.data.map(exercise => ({
                ...exercise,
                name: capitaliseWords(exercise.name),
                bodyPart: capitaliseWords(exercise.bodyPart),
                equipment: capitaliseWords(exercise.equipment),
                target: capitaliseWords(exercise.target),
                secondaryMuscles: exercise.secondaryMuscles.map(muscle => capitaliseWords(muscle))
            }));
            return exercises;
        } catch (error) {
            console.error('Fetch exercises error:', error.response ? error.response.data : error.message);
            return rejectWithValue(error.response.data || 'Failed to fetch exercises');
        }
    }
);

// Thunk to fetch an exercise by ID
export const fetchExerciseById = createAsyncThunk(
    'exercises/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/exercises/${id}`);
            const exercise = response.data;

            // Capitalize the necessary fields in the exercise
            exercise.name = capitaliseWords(exercise.name);
            exercise.bodyPart = capitaliseWords(exercise.bodyPart);
            exercise.equipment = capitaliseWords(exercise.equipment);
            exercise.target = capitaliseWords(exercise.target);
            exercise.secondaryMuscles = exercise.secondaryMuscles.map(muscle => capitaliseWords(muscle));

            return exercise;
        } catch (error) {
            console.error('Fetch exercise by ID error:', error.response ? error.response.data : error.message);
            return rejectWithValue(error.response.data || 'Failed to fetch exercise');
        }
    }
);

const exerciseSlice = createSlice({
    name: 'exercises',
    initialState: {
        exercises: [],
        selectedExercise: null,
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
            })
            .addCase(fetchExerciseById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchExerciseById.fulfilled, (state, action) => {
                state.selectedExercise = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchExerciseById.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            });
    },
});

export default exerciseSlice.reducer;