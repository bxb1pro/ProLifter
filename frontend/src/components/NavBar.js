import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NavBar = () => {
    const role = useSelector((state) => state.auth.role); // Get the role from the Redux state

    return (
        <nav>
            <ul>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/exercises">Exercises</Link></li>
                <li><Link to="/preset-templates">Preset Templates</Link></li>
                <li><Link to="/preset-workouts">Preset Workouts</Link></li>
                {/* Conditionally render links based on the user's role */}
                {role === 'user' && (
                    <>
                        <li><Link to="/custom-templates">Custom Templates</Link></li>
                        <li><Link to="/custom-workouts">Custom Workouts</Link></li>
                        <li><Link to="/workout-logs">Workout Logs</Link></li>
                    </>
                )}
                <li><Link to="/account">Account</Link></li>
                <li><Link to="/logout">Logout</Link></li>
            </ul>
        </nav>
    );
};

export default NavBar;