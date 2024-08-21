import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import exerciseReducer from '../features/exercises/exerciseSlice';
import presetWorkoutReducer from '../features/presetWorkouts/presetWorkoutSlice';
import workoutLogReducer from '../features/workoutLogs/workoutLogSlice';
import exerciseLogSlice from '../features/exerciseLogs/exerciseLogSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        exercises: exerciseReducer,
        presetWorkouts: presetWorkoutReducer,
        workoutLogs: workoutLogReducer,
        exerciseLog: exerciseLogSlice,
    },
});

export default store;