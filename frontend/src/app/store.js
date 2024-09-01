import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import exerciseReducer from '../features/exercises/exerciseSlice';
import presetWorkoutReducer from '../features/presetWorkouts/presetWorkoutSlice';
import workoutLogReducer from '../features/workoutLogs/workoutLogSlice';
import exerciseLogReducer from '../features/exerciseLogs/exerciseLogSlice';
import setLogReducer from '../features/setLogs/setLogSlice';
import customWorkoutReducer from '../features/customWorkouts/customWorkoutSlice'; 
import presetTemplateReducer from '../features/presetTemplates/presetTemplateSlice';
import customTemplateReducer from '../features/customTemplates/customTemplateSlice';

// Configures Redux store, holds global state of application
const store = configureStore({
    reducer: {
        auth: authReducer,
        exercises: exerciseReducer,
        presetWorkouts: presetWorkoutReducer,
        workoutLogs: workoutLogReducer,
        exerciseLogs: exerciseLogReducer,
        setLogs: setLogReducer,
        customWorkouts: customWorkoutReducer,
        presetTemplates: presetTemplateReducer,
        customTemplates: customTemplateReducer,
    },
});

export default store;