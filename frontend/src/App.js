import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard';
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

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/logout" element={<Logout />} /> 
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/exercises/:id" element={<ExerciseDetails />} />
            <Route path="/preset-workouts" element={<PresetWorkout />} />
            <Route path="/workout-logs" element={<WorkoutLogs />} />
            <Route path="/workout-logs/:workoutLogID/exercise-logs" element={<ExerciseLogs />} /> 
            <Route path="/exercise-logs/:exerciseLogID/set-logs" element={<SetLogs />} /> 
            <Route path="/custom-workouts" element={<CustomWorkouts />} /> 
            <Route path="/account" element={<Account />} />
            <Route path="/user-workouts" element={<UserWorkouts />} /> 
        </Routes>
    );
}

export default App;