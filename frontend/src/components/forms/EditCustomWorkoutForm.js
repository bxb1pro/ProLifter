import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editCustomWorkout, fetchUserCustomWorkouts } from '../../features/customWorkouts/customWorkoutSlice';

const EditCustomWorkoutForm = ({ workout, onClose }) => {
  const [customWorkoutName, setCustomWorkoutName] = useState(workout.customWorkoutName);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customWorkoutName) {
      dispatch(editCustomWorkout({ id: workout.customWorkoutID, customWorkoutName})).then(() => {
        dispatch(fetchUserCustomWorkouts());
      });
      
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
      <button type="submit">Save Changes</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default EditCustomWorkoutForm;