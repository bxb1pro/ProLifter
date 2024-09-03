import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { Modal, Button } from 'react-bootstrap';

const Logout = () => {
    const [show, setShow] = useState(true);  // State to control visibility of modal
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle the logout process
    const handleLogout = () => {
        dispatch(logout());
        navigate('/');  // Redirect to the homepage after logout
    };

    // Close modal and navigate back if user cancels
    const handleClose = () => {
        setShow(false);
        navigate(-1); // Go back to the previous page user was on
    };

    return (
        // Logout Confirmation Modal
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Logout</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to log out?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleLogout}>
                    Logout
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Logout;