import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editPresetWorkout } from '../../features/presetWorkouts/presetWorkoutSlice';

const EditPresetWorkoutForm = ({ workout, onClose }) => {
  const [presetWorkoutName, setPresetWorkoutName] = useState(workout.presetWorkoutName);
  const [presetWorkoutDays, setPresetWorkoutDays] = useState(workout.presetWorkoutDays);
  const [presetWorkoutDifficulty, setPresetWorkoutDifficulty] = useState(workout.presetWorkoutDifficulty);
  const [presetWorkoutGoal, setPresetWorkoutGoal] = useState(workout.presetWorkoutGoal);
  const [presetWorkoutLocation, setPresetWorkoutLocation] = useState(workout.presetWorkoutLocation);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      presetWorkoutName &&
      presetWorkoutDays &&
      presetWorkoutDifficulty &&
      presetWorkoutGoal &&
      presetWorkoutLocation
    ) {
      dispatch(
        editPresetWorkout({
          id: workout.presetWorkoutID,
          presetWorkoutName,
          presetWorkoutDays,
          presetWorkoutDifficulty,
          presetWorkoutGoal,
          presetWorkoutLocation,
        })
      );
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
        Number of Days:
        <input
          type="number"
          value={presetWorkoutDays}
          onChange={(e) => setPresetWorkoutDays(e.target.value)}
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
      <button type="submit">Save Changes</button>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
};

export default EditPresetWorkoutForm;