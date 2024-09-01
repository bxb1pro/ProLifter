import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editPresetWorkout, fetchPresetWorkouts } from '../../features/presetWorkouts/presetWorkoutSlice';

const EditPresetWorkoutForm = ({ workout, onClose }) => {
  // Initialise state with existing workout data
  const [presetWorkoutName, setPresetWorkoutName] = useState(workout.presetWorkoutName);
  const [presetWorkoutDifficulty, setPresetWorkoutDifficulty] = useState(workout.presetWorkoutDifficulty);
  const [presetWorkoutGoal, setPresetWorkoutGoal] = useState(workout.presetWorkoutGoal);
  const [presetWorkoutLocation, setPresetWorkoutLocation] = useState(workout.presetWorkoutLocation);
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
      // Dispatch action to edit preset workout with updated data
      dispatch(
        editPresetWorkout({
          id: workout.presetWorkoutID,
          presetWorkoutName,
          presetWorkoutDifficulty,
          presetWorkoutGoal,
          presetWorkoutLocation,
        })
      ).then(() => {
        // Refetch preset workouts to update the state
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
            <h5 className="modal-title">Edit Preset Workout</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Input for workout name */}
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
              {/* Dropdown for difficulty level - Restricted input */}
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
              {/* Dropdown for workout goal - Restricted input */}
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
              {/* Dropdown for workout location - Restricted input */}
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
              {/* Form buttons */}
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Save Changes</button>
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

export default EditPresetWorkoutForm;