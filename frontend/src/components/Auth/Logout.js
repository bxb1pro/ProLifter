import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Dispatch the logout action
        dispatch(logout());
        // Redirect to the login page
        navigate('/');
    }, [dispatch, navigate]);

    return null; // No UI needed for logout, just redirects
};

export default Logout;