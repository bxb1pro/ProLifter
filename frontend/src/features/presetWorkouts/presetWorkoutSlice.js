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
    async ({ presetWorkoutID, exerciseID, defaultSets, defaultReps, defaultRPE }, { rejectWithValue }) => {
      try {
        const response = await api.post(`/preset-workout-exercises/${presetWorkoutID}/link-exercise`, { 
          exerciseID, 
          defaultSets, 
          defaultReps, 
          defaultRPE 
        });
        return response.data;
      } catch (error) {
        console.error('Link exercise to preset workout error:', error.response ? error.response.data : error.message);
        return rejectWithValue(error.response.data || 'Failed to link exercise');
      }
    }
  );

// Thunk to unlink an exercise from a preset workout
export const unlinkExerciseFromPresetWorkout = createAsyncThunk(
    'presetWorkouts/unlinkExerciseFromPresetWorkout',
    async ({ presetWorkoutID, exerciseID }, { rejectWithValue }) => {
      try {
        const response = await api.post(`/preset-workout-exercises/${presetWorkoutID}/unlink-exercise`, { exerciseID });
        return response.data;
      } catch (error) {
        console.error('Unlink exercise from preset workout error:', error.response ? error.response.data : error.message);
        return rejectWithValue(error.response.data || 'Failed to unlink exercise');
      }
    }
  );

// Thunk to fetch exercises for a specific preset workout
export const fetchExercisesForPresetWorkout = createAsyncThunk(
    'presetWorkouts/fetchExercisesForPresetWorkout',
    async (presetWorkoutID, { rejectWithValue }) => {
      try {
        const response = await api.get(`/preset-workout-exercises/${presetWorkoutID}/exercises`);
        return response.data;
      } catch (error) {
        console.error('Fetch exercises for preset workout error:', error.response ? error.response.data : error.message);
        return rejectWithValue(error.response.data || 'Failed to fetch exercises');
      }
    }
  );

// Thunk to create a preset workout
export const createPresetWorkout = createAsyncThunk(
    'presetWorkouts/createPresetWorkout',
    async ({ presetWorkoutName, presetWorkoutDifficulty, presetWorkoutGoal, presetWorkoutLocation }, { rejectWithValue }) => {
      try {
        const response = await api.post('/preset-workouts', { presetWorkoutName, presetWorkoutDifficulty, presetWorkoutGoal, presetWorkoutLocation });
        return response.data;
      } catch (error) {
        console.error('Create preset workout error:', error.response ? error.response.data : error.message);
        return rejectWithValue(error.response.data || 'Failed to create preset workout');
      }
    }
  );
  
// Thunk to edit a preset workout
export const editPresetWorkout = createAsyncThunk(
'presetWorkouts/editPresetWorkout',
async ({ id, presetWorkoutName, presetWorkoutDifficulty, presetWorkoutGoal, presetWorkoutLocation }, { rejectWithValue }) => {
    try {
    const response = await api.put(`/preset-workouts/${id}`, { presetWorkoutName, presetWorkoutDifficulty, presetWorkoutGoal, presetWorkoutLocation });
    return response.data;
    } catch (error) {
    console.error('Edit preset workout error:', error.response ? error.response.data : error.message);
    return rejectWithValue(error.response.data || 'Failed to edit preset workout');
    }
}
);
  
// Thunk to delete a preset workout
export const deletePresetWorkout = createAsyncThunk(
'presetWorkouts/deletePresetWorkout',
async (id, { rejectWithValue }) => {
    try {
    const response = await api.delete(`/preset-workouts/${id}`);
    return id;
    } catch (error) {
    console.error('Delete preset workout error:', error.response ? error.response.data : error.message);
    return rejectWithValue(error.response.data || 'Failed to delete preset workout');
    }
}
);
  
  const presetWorkoutSlice = createSlice({
    name: 'presetWorkouts',
    initialState: {
      workouts: [],
      exercises: {},  // Store exercises for each preset workout
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
          state.status = 'succeeded';
        })
        .addCase(linkExerciseToPresetWorkout.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(unlinkExerciseFromPresetWorkout.fulfilled, (state, action) => {
          state.status = 'succeeded';
          const { presetWorkoutID, exerciseID } = action.meta.arg;
          state.exercises[presetWorkoutID] = state.exercises[presetWorkoutID].filter(exercise => exercise.exerciseID !== exerciseID);
        })
        .addCase(unlinkExerciseFromPresetWorkout.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(fetchExercisesForPresetWorkout.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchExercisesForPresetWorkout.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.exercises[action.meta.arg] = action.payload;
        })
        .addCase(fetchExercisesForPresetWorkout.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(createPresetWorkout.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.workouts.push(action.payload);
        })
        .addCase(createPresetWorkout.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(editPresetWorkout.fulfilled, (state, action) => {
          state.status = 'succeeded';
          const updatedWorkout = action.payload;
          const index = state.workouts.findIndex(workout => workout.presetWorkoutID === updatedWorkout.presetWorkoutID);
          if (index !== -1) {
            state.workouts[index] = updatedWorkout;
          }
        })
        .addCase(editPresetWorkout.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(deletePresetWorkout.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.workouts = state.workouts.filter(workout => workout.presetWorkoutID !== action.payload);
        })
        .addCase(deletePresetWorkout.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    },
  });
  
  export default presetWorkoutSlice.reducer;