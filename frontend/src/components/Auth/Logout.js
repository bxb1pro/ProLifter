import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Show confirmation popup
        const confirmed = window.confirm('Are you sure you want to log out?');

        if (confirmed) {
            // Dispatch the logout action
            dispatch(logout());
            // Redirect to the login page
            navigate('/');
        } else {
            // Redirect back to the previous page if the user cancels logout
            navigate(-1); // Go back to the previous page
        }
    }, [dispatch, navigate]);

    return null; // No UI needed for logout, just redirects
};

export default Logout;