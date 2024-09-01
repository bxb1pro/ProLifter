import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccountDetails, deleteAccount } from '../features/auth/authSlice';
import { Button, Form, Alert, Modal } from 'react-bootstrap';

const Account = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const [password, setPassword] = useState(''); // State to store user password for confirmation
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [showModal, setShowModal] = useState(false); // Controls visibility of confirmation modal
  const role = useSelector((state) => state.auth.role); // Get's user role from Redux state

  // Fetch account details if not loaded on component mount
  useEffect(() => {
    if (!user) {
      dispatch(fetchAccountDetails());
    }
  }, [dispatch, user]);

  // Handle account deletion with confirmation
  const handleDeleteAccount = () => {
    if (password) {
      dispatch(deleteAccount(password))
        .unwrap()
        .then(() => {
          setShowModal(false);
        })
        .catch((error) => {
          console.error('Error deleting account:', error);
          alert(`Failed to delete account: ${error.message || 'Unknown error'}`);
        });
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      <h2>Account Details</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {user ? (
        <div className="mb-4">
          {/* Display user's account details */}
          <p><strong>Name:</strong> {user.userName}</p>
          <p><strong>Email:</strong> {user.userEmail}</p>
          {(role === 'admin' || role === 'superadmin') && (
            <p><strong>Role:</strong> {user.role}</p>
          )}
          <p><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      ) : (
        <Alert variant="warning">No user details available.</Alert>
      )}
      <Button variant="danger" onClick={() => setShowModal(true)}>
        Delete Account
      </Button>
      {/* Confirm Account Deletion Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          {/* Input for password confirmation */}
          <Form.Group controlId="password">
            <Form.Label>Enter your password to confirm:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Account;