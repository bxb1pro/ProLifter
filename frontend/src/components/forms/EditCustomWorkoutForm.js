import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editCustomWorkout } from '../../features/customWorkouts/customWorkoutSlice';

const EditCustomWorkoutForm = ({ workout, onClose }) => {
  const [customWorkoutName, setCustomWorkoutName] = useState(workout.customWorkoutName);
  const [customWorkoutDays, setCustomWorkoutDays] = useState(workout.customWorkoutDays);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customWorkoutName && customWorkoutDays) {
      dispatch(editCustomWorkout({ id: workout.customWorkoutID, customWorkoutName, customWorkoutDays }));
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
      <label>
        Number of Days:
        <input
          type="number"
          value={customWorkoutDays}
          onChange={(e) => setCustomWorkoutDays(e.target.value)}
          required
        />
      </label>
      <button type="submit">Save Changes</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default EditCustomWorkoutForm;