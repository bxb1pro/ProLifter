import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPresetWorkout, fetchPresetWorkouts } from '../../features/presetWorkouts/presetWorkoutSlice';

const AddPresetWorkoutForm = ({ onClose }) => {
  // State variables for form inputs
  const [presetWorkoutName, setPresetWorkoutName] = useState('');
  const [presetWorkoutDifficulty, setPresetWorkoutDifficulty] = useState('');
  const [presetWorkoutGoal, setPresetWorkoutGoal] = useState('');
  const [presetWorkoutLocation, setPresetWorkoutLocation] = useState('');
  const dispatch = useDispatch();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      presetWorkoutName &&
      presetWorkoutDifficulty &&
      presetWorkoutGoal &&
      presetWorkoutLocation
    ) {
      // Dispatch action to create new preset workout
      dispatch(createPresetWorkout({
        presetWorkoutName,
        presetWorkoutDifficulty,
        presetWorkoutGoal,
        presetWorkoutLocation,
      })).then(() => {
        // Refetch the workouts after they're added to update state
        dispatch(fetchPresetWorkouts());
      });
  
      onClose();
    }
  };

  return (
    <div className="modal show d-block" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Preset Workout</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Workout Name Input */}
              <div className="mb-3">
                <label htmlFor="presetWorkoutName" className="form-label">Workout Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="presetWorkoutName"
                  value={presetWorkoutName}
                  onChange={(e) => setPresetWorkoutName(e.target.value)}
                  required
                />
              </div>
              {/* Difficulty Input - Restricted Input*/}
              <div className="mb-3">
                <label htmlFor="presetWorkoutDifficulty" className="form-label">Difficulty</label>
                <select
                  className="form-select"
                  id="presetWorkoutDifficulty"
                  value={presetWorkoutDifficulty}
                  onChange={(e) => setPresetWorkoutDifficulty(e.target.value)}
                  required
                >
                  <option value="">Select Difficulty</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              {/* Goal Input - Restricted Input*/}
              <div className="mb-3">
                <label htmlFor="presetWorkoutGoal" className="form-label">Goal</label>
                <select
                  className="form-select"
                  id="presetWorkoutGoal"
                  value={presetWorkoutGoal}
                  onChange={(e) => setPresetWorkoutGoal(e.target.value)}
                  required
                >
                  <option value="">Select Goal</option>
                  <option value="Size">Size</option>
                  <option value="Strength">Strength</option>
                  <option value="Overall">Overall</option>
                </select>
              </div>
              {/* Location Input - Restricted Input*/}
              <div className="mb-3">
                <label htmlFor="presetWorkoutLocation" className="form-label">Location</label>
                <select
                  className="form-select"
                  id="presetWorkoutLocation"
                  value={presetWorkoutLocation}
                  onChange={(e) => setPresetWorkoutLocation(e.target.value)}
                  required
                >
                  <option value="">Select Location</option>
                  <option value="Gym">Gym</option>
                  <option value="Home">Home</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Add Workout</button>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPresetWorkoutForm;