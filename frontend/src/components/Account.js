import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccountDetails, deleteAccount } from '../features/auth/authSlice';

const Account = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const [password, setPassword] = useState('');
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    if (!user) {
      dispatch(fetchAccountDetails());
    }
  }, [dispatch, user]);

  const handleDeleteAccount = () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmed && password) {
      dispatch(deleteAccount(password))
        .unwrap()
        .then(() => {
          alert('Account deleted successfully.');
        })
        .catch((error) => {
          console.error('Error deleting account:', error);
          alert(`Failed to delete account: ${error.message || 'Unknown error'}`);
        });
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <section>
      <h2>Account Details</h2>
      {error && <p>{error}</p>}
      {user ? (
        <div>
          <p>Name: {user.userName}</p>
          <p>Email: {user.userEmail}</p>
          {(role === 'admin' || role === 'superadmin') && (
          <p>Role: {user.role}</p>
          )}
          <p>Account Created: {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      ) : (
        <p>No user details available.</p>
      )}
      <button onClick={() => setShowDeleteForm(!showDeleteForm)}>
        {showDeleteForm ? 'Cancel' : 'Delete Account'}
      </button>
      {showDeleteForm && (
        <div>
          <h3>Confirm Account Deletion</h3>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleDeleteAccount}>Delete Account</button>
        </div>
      )}
    </section>
  );
};

export default Account;