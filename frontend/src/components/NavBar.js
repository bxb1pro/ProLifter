// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/exercises">Exercises</Link></li>
                <li><Link to="/preset-workouts">Preset Workouts</Link></li>
                <li><Link to="/custom-workouts">Custom Workouts</Link></li>
                <li><Link to="/workout-logs">Workout Logs</Link></li>
                <li><Link to="/account">Account</Link></li>
                <li><Link to="/logout">Logout</Link></li>
            </ul>
        </nav>
    );
};

export default NavBar;