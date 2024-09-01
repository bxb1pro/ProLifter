import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Function to capitalise exercise words from API (in slice to avoid repetition in components)
const capitaliseWords = (str) => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

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
        return rejectWithValue(error.response?.data || 'Failed to link exercise');
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
      const exercises = response.data;

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
        return []; // Return an empty array if no exercises, bug fix
      }
      return rejectWithValue(error.response?.data || 'Failed to fetch exercises');
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

// Thunk to link a preset workout to a user
export const linkPresetWorkoutToUser = createAsyncThunk(
    'presetWorkouts/linkPresetWorkoutToUser',
    async ({ userID, presetWorkoutID }, { rejectWithValue }) => {
      try {
        const response = await api.post(`/user-preset-workouts/${userID}/link-preset-workout`, { presetWorkoutID });
        return response.data;
      } catch (error) {
        console.error('Link preset workout to user error:', error.response ? error.response.data : error.message);
        return rejectWithValue(error.response?.data || 'Failed to link preset workout to user');
      }
    }
  );

  // Thunk to unlink a preset workout from a user
export const unlinkPresetWorkoutFromUser = createAsyncThunk(
    'presetWorkouts/unlinkPresetWorkoutFromUser',
    async ({ userID, presetWorkoutID }, { rejectWithValue }) => {
      try {
        const response = await api.post(`/user-preset-workouts/${userID}/unlink-preset-workout`, { presetWorkoutID });
        return { userID, presetWorkoutID };
      } catch (error) {
        console.error('Unlink preset workout from user error:', error.response ? error.response.data : error.message);
        return rejectWithValue(error.response.data || 'Failed to unlink preset workout from user');
      }
    }
  );

// Thunk to fetch preset workouts linked to a user
export const fetchUserPresetWorkouts = createAsyncThunk(
    'presetWorkouts/fetchUserPresetWorkouts',
    async (userID, { rejectWithValue }) => {
      try {
        const response = await api.get(`/user-preset-workouts/${userID}/preset-workouts`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data || 'Failed to fetch user preset workouts');
      }
    }
);
  
  const presetWorkoutSlice = createSlice({
    name: 'presetWorkouts',
    initialState: {
      workouts: [],
      userWorkouts: [], 
      exercises: {},
      status: 'idle',
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
          state.error = action.payload;
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
        })
        .addCase(linkPresetWorkoutToUser.fulfilled, (state, action) => {
            state.status = 'succeeded';
        })
        .addCase(linkPresetWorkoutToUser.rejected, (state, action) => {
          if (action.payload?.error === 'Preset workout is already linked to this user') {
            state.status = 'succeeded';
            state.error = action.payload?.error;
          } else {
            state.status = 'failed';
            state.error = action.payload;
          }
        })
        .addCase(fetchUserPresetWorkouts.pending, (state) => {
            state.status = 'loading';
          })
        .addCase(fetchUserPresetWorkouts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userWorkouts = action.payload;
        })
        .addCase(fetchUserPresetWorkouts.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        })
        .addCase(unlinkPresetWorkoutFromUser.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.userWorkouts = state.userWorkouts.filter(workout => workout.presetWorkoutID !== action.payload.presetWorkoutID);
        })
        .addCase(unlinkPresetWorkoutFromUser.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        });
    },
  });
  
  export default presetWorkoutSlice.reducer;