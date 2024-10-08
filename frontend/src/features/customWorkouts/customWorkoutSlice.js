import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Function to capitalise exercise words from API (in slice to avoid repetition in components)
const capitaliseWords = (str) => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};


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
      return rejectWithValue(error.response?.data || 'Failed to link exercise');
    }
  }
);

// Thunk to unlink an exercise from a custom workout
export const unlinkExerciseFromCustomWorkout = createAsyncThunk(
    'customWorkouts/unlinkExerciseFromCustomWorkout',
    async ({ customWorkoutID, exerciseID }, { rejectWithValue }) => {
      try {
        const response = await api.post(`/custom-workout-exercises/${customWorkoutID}/unlink-exercise`, { exerciseID });
        return response.data;
      } catch (error) {
        console.error('Unlink exercise from custom workout error:', error.response ? error.response.data : error.message);
        return rejectWithValue(error.response.data || 'Failed to unlink exercise');
      }
    }
  );

// New Thunk to fetch exercises for a specific custom workout
export const fetchExercisesForCustomWorkout = createAsyncThunk(
  'customWorkouts/fetchExercisesForCustomWorkout',
  async (customWorkoutID, { rejectWithValue }) => {
    try {
      const response = await api.get(`/custom-workout-exercises/${customWorkoutID}/exercises`);
      const exercises = response.data;

      // Capitalise the necessary fields in each exercise
      const capitalisedExercises = exercises.map(exercise => ({
        ...exercise,
        Exercise: {
          ...exercise.Exercise,
          exerciseName: capitaliseWords(exercise.Exercise.exerciseName),
          exerciseBodypart: capitaliseWords(exercise.Exercise.exerciseBodypart),
        },
      }));

      return capitalisedExercises;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return []; // Return an empty array when no exercises are found, bug fix
      }
      return rejectWithValue(error.response?.data || 'Failed to fetch exercises');
    }
  }
);

  // Thunk to create a custom workout
export const createCustomWorkout = createAsyncThunk(
    'customWorkouts/createCustomWorkout',
    async ({ customWorkoutName }, { rejectWithValue }) => {
      try {
        const response = await api.post('/custom-workouts', { customWorkoutName });
        return response.data;
      } catch (error) {
        console.error('Create custom workout error:', error.response ? error.response.data : error.message);
        return rejectWithValue(error.response.data || 'Failed to create custom workout');
      }
    }
  );
  
  // Thunk to edit a custom workout
  export const editCustomWorkout = createAsyncThunk(
    'customWorkouts/editCustomWorkout',
    async ({ id, customWorkoutName }, { rejectWithValue }) => {
      try {
        const response = await api.put(`/custom-workouts/${id}/edit`, { customWorkoutName });
        return response.data;
      } catch (error) {
        console.error('Edit custom workout error:', error.response ? error.response.data : error.message);
        return rejectWithValue(error.response.data || 'Failed to edit custom workout');
      }
    }
  );

  // Thunk to delete a custom workout
    export const deleteCustomWorkout = createAsyncThunk(
    'customWorkouts/deleteCustomWorkout',
    async (id, { rejectWithValue }) => {
      try {
        const response = await api.delete(`/custom-workouts/${id}/delete`);
        return id;
      } catch (error) {
        console.error('Delete custom workout error:', error.response ? error.response.data : error.message);
        return rejectWithValue(error.response.data || 'Failed to delete custom workout');
      }
    }
  );    
  
  const customWorkoutSlice = createSlice({
    name: 'customWorkouts',
    initialState: {
      workouts: [],
      exercises: {},
      status: 'idle',
      error: null,
    },
    reducers: {
      clearError: (state) => {
        state.error = null; // Reset the error state (bug fix)
        state.status = 'idle'; 
      }
    },
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
          state.status = 'succeeded';
        })
        .addCase(linkExerciseToCustomWorkout.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
        .addCase(unlinkExerciseFromCustomWorkout.fulfilled, (state, action) => {
          state.status = 'succeeded';
          const { customWorkoutID, exerciseID } = action.meta.arg;
          state.exercises[customWorkoutID] = state.exercises[customWorkoutID].filter(exercise => exercise.exerciseID !== exerciseID);
        })
        .addCase(unlinkExerciseFromCustomWorkout.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(fetchExercisesForCustomWorkout.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchExercisesForCustomWorkout.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.exercises[action.meta.arg] = action.payload;
        })
        .addCase(fetchExercisesForCustomWorkout.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(deleteCustomWorkout.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.workouts = state.workouts.filter(workout => workout.customWorkoutID !== action.payload);
        })
        .addCase(deleteCustomWorkout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        });
    },
  });
  
  export const { clearError } = customWorkoutSlice.actions;
  export default customWorkoutSlice.reducer;
