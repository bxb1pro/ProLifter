import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import exerciseReducer from '../features/exercises/exerciseSlice';
import presetWorkoutReducer from '../features/presetWorkouts/presetWorkoutSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        exercises: exerciseReducer,
        presetWorkouts: presetWorkoutReducer,
    },
});

export default store;