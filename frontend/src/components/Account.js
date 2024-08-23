import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccountDetails, deleteAccount } from '../features/auth/authSlice';

const Account = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const [password, setPassword] = useState('');
  const [showDeleteForm, setShowDeleteForm] = useState(false);

  useEffect(() => {
    dispatch(fetchAccountDetails());
  }, [dispatch]);

  const handleDeleteAccount = () => {
    if (password) {
      dispatch(deleteAccount(password));
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
          <p>Role: {user.role}</p>
          <p>Account Created: {new Date(user.userDateCreated).toLocaleDateString()}</p>
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