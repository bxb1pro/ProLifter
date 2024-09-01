import React, { useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from './components/NavBar';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Logout from './components/Auth/Logout';
import Exercises from './components/Exercises';
import ExerciseDetails from './components/ExerciseDetails';
import PresetWorkout from './components/PresetWorkout';
import WorkoutLogs from './components/WorkoutLogs';
import SetLogs from './components/SetLogs'; 
import CustomWorkouts from './components/CustomWorkouts'; 
import Account from './components/Account';
import WorkoutLogDetails from './components/WorkoutLogDetails';
import PresetTemplate from './components/PresetTemplate';
import CustomTemplate from './components/CustomTemplate';
import LandingPage from './components/LandingPage';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './components/HomePage';
import { fetchAccountDetails } from './features/auth/authSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    const location = useLocation();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const hideNavBar = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup';

    // Fetch JWT token in app.js to avoid repetitive code through placing it at the start of each component
    useEffect(() => {
        if (token) {
            dispatch(fetchAccountDetails());
        }
    }, [dispatch, token]);

    return (
        <>
            {!hideNavBar && <NavBar />}
            <div className={!hideNavBar ? 'content-with-navbar' : ''}>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected routes */}
                    <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
                    <Route path="/logout" element={<PrivateRoute><Logout /></PrivateRoute>} />
                    <Route path="/exercises" element={<PrivateRoute><Exercises /></PrivateRoute>} />
                    <Route path="/exercises/:id" element={<PrivateRoute><ExerciseDetails /></PrivateRoute>} />
                    <Route path="/preset-workouts" element={<PrivateRoute><PresetWorkout /></PrivateRoute>} />
                    <Route path="/workout-logs" element={<PrivateRoute><WorkoutLogs /></PrivateRoute>} />
                    <Route path="/exercise-logs/:exerciseLogID/set-logs" element={<PrivateRoute><SetLogs /></PrivateRoute>} />
                    <Route path="/custom-workouts" element={<PrivateRoute><CustomWorkouts /></PrivateRoute>} />
                    <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
                    <Route path="/workout-logs/:workoutLogID" element={<PrivateRoute><WorkoutLogDetails /></PrivateRoute>} />
                    <Route path="/preset-templates" element={<PrivateRoute><PresetTemplate /></PrivateRoute>} />
                    <Route path="/custom-templates" element={<PrivateRoute><CustomTemplate /></PrivateRoute>} />

                    {/* Redirect to landing page for any unmatched routes */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </>
    );
}

export default App;