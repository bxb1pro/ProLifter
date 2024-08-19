import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import exerciseReducer from '../features/exercises/exerciseSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        exercises: exerciseReducer,
    },
});

export default store;