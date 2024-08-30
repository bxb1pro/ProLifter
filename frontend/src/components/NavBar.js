import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './NavBar.css'; // Import the CSS file
import { BsPerson } from 'react-icons/bs'; // Import the person icon from react-icons

const NavBar = () => {
    const role = useSelector((state) => state.auth.role); // Get the role from the Redux state

    return (
        <nav className="navbar">
            <div className="container">
                <ul className="nav m-0">
                    <li className="nav-item">
                        <Link className="nav-link logo-link" to="/home">
                            <img src="/images/logo.jpg" alt="Logo" className="logo-img" />
                            <span className="tooltip-text">Home</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/exercises">Exercises</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/preset-templates">Preset Templates</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/preset-workouts">Preset Workouts</Link>
                    </li>
                    {/* Conditionally render links based on the user's role */}
                    {role === 'user' && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/custom-templates">Custom Templates</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/custom-workouts">Custom Workouts</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/workout-logs">Workout Logs</Link>
                            </li>
                        </>
                    )}
                    <li className="nav-item">
                        <Link className="nav-link account-link" to="/account">
                            <BsPerson />
                            <span className="tooltip-text">Account</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/logout">Logout</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;