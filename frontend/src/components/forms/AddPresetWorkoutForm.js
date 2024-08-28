import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPresetWorkout, fetchPresetWorkouts } from '../../features/presetWorkouts/presetWorkoutSlice';

const AddPresetWorkoutForm = ({ onClose }) => {
  const [presetWorkoutName, setPresetWorkoutName] = useState('');
  const [presetWorkoutDifficulty, setPresetWorkoutDifficulty] = useState('');
  const [presetWorkoutGoal, setPresetWorkoutGoal] = useState('');
  const [presetWorkoutLocation, setPresetWorkoutLocation] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      presetWorkoutName &&
      presetWorkoutDifficulty &&
      presetWorkoutGoal &&
      presetWorkoutLocation
    ) {
      dispatch(createPresetWorkout({
        presetWorkoutName,
        presetWorkoutDifficulty,
        presetWorkoutGoal,
        presetWorkoutLocation,
      })).then(() => {
        // Refetch the workouts after they're added
        dispatch(fetchPresetWorkouts());
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
          value={presetWorkoutName}
          onChange={(e) => setPresetWorkoutName(e.target.value)}
          required
        />
      </label>
      <label>
        Difficulty:
        <input
          type="text"
          value={presetWorkoutDifficulty}
          onChange={(e) => setPresetWorkoutDifficulty(e.target.value)}
          required
        />
      </label>
      <label>
        Goal:
        <input
          type="text"
          value={presetWorkoutGoal}
          onChange={(e) => setPresetWorkoutGoal(e.target.value)}
          required
        />
      </label>
      <label>
        Location:
        <input
          type="text"
          value={presetWorkoutLocation}
          onChange={(e) => setPresetWorkoutLocation(e.target.value)}
          required
        />
      </label>
      <button type="submit">Add Workout</button>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
};

export default AddPresetWorkoutForm;