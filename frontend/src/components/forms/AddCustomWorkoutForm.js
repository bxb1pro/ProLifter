import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCustomWorkout } from '../../features/customWorkouts/customWorkoutSlice';

const AddCustomWorkoutForm = ({ onClose }) => {
  const [customWorkoutName, setCustomWorkoutName] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customWorkoutName) {
      dispatch(createCustomWorkout({ customWorkoutName }));
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Workout Name:
        <input
          type="text"
          value={customWorkoutName}
          onChange={(e) => setCustomWorkoutName(e.target.value)}
          required
        />
      </label>
      <button type="submit">Add Workout</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default AddCustomWorkoutForm;