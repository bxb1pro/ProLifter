import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './NavBar.css';
import { BsPerson } from 'react-icons/bs';

const NavBar = () => {
    const role = useSelector((state) => state.auth.role); // Get user role from Redux state

    // Place links to various components in Navbar
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
                    {/* Conditional links to show based on user role */}
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