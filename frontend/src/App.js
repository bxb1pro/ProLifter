import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Logout from './components/Auth/Logout';
import Exercises from './components/Exercises';
import ExerciseDetails from './components/ExerciseDetails';
import PresetWorkout from './components/PresetWorkout';
import WorkoutLogs from './components/WorkoutLogs';
import ExerciseLogs from './components/ExerciseLogs';
import SetLogs from './components/SetLogs'; 
import CustomWorkouts from './components/CustomWorkouts'; 
import Account from './components/Account';
import UserWorkouts from './components/UserWorkouts';
import WorkoutLogDetails from './components/WorkoutLogDetails';
import PresetTemplate from './components/PresetTemplate';
import UserTemplates from './components/UserTemplates';
import CustomTemplate from './components/CustomTemplate';
import LandingPage from './components/LandingPage';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './components/HomePage';

function App() {
    const location = useLocation();
    const hideNavBar = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup';

    return (
        <>
            {!hideNavBar && <NavBar />}
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected routes */}
                <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
                <Route path="/logout" element={<PrivateRoute><Logout /></PrivateRoute>} />
                <Route path="/exercises" element={<PrivateRoute><Exercises /></PrivateRoute>} />
                <Route path="/exercises/:id" element={<PrivateRoute><ExerciseDetails /></PrivateRoute>} />
                <Route path="/preset-workouts" element={<PrivateRoute><PresetWorkout /></PrivateRoute>} />
                <Route path="/workout-logs" element={<PrivateRoute><WorkoutLogs /></PrivateRoute>} />
                <Route path="/workout-logs/:workoutLogID/exercise-logs" element={<PrivateRoute><ExerciseLogs /></PrivateRoute>} />
                <Route path="/exercise-logs/:exerciseLogID/set-logs" element={<PrivateRoute><SetLogs /></PrivateRoute>} />
                <Route path="/custom-workouts" element={<PrivateRoute><CustomWorkouts /></PrivateRoute>} />
                <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
                <Route path="/user-workouts" element={<PrivateRoute><UserWorkouts /></PrivateRoute>} />
                <Route path="/workout-logs/:workoutLogID" element={<PrivateRoute><WorkoutLogDetails /></PrivateRoute>} />
                <Route path="/preset-templates" element={<PrivateRoute><PresetTemplate /></PrivateRoute>} />
                <Route path="/user-templates" element={<PrivateRoute><UserTemplates /></PrivateRoute>} />
                <Route path="/custom-templates" element={<PrivateRoute><CustomTemplate /></PrivateRoute>} />

                {/* Redirect to landing page for any unmatched routes */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default App;