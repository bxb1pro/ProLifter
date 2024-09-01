import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editCustomWorkout, fetchUserCustomWorkouts } from '../../features/customWorkouts/customWorkoutSlice';

const EditCustomWorkoutForm = ({ workout, onClose }) => {
  // Initialise state with current workout's name
  const [customWorkoutName, setCustomWorkoutName] = useState(workout.customWorkoutName);
  const dispatch = useDispatch();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (customWorkoutName) {
      dispatch(editCustomWorkout({ id: workout.customWorkoutID, customWorkoutName })).then(() => {
        // Refetch custom workouts to update the state after editing
        dispatch(fetchUserCustomWorkouts());
      });

      onClose();
    }
  };

  return (
    <div className="modal show d-block" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Custom Workout</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Input for editing workout name */}
              <div className="mb-3">
                <label htmlFor="customWorkoutName" className="form-label">Workout Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="customWorkoutName"
                  value={customWorkoutName}
                  onChange={(e) => setCustomWorkoutName(e.target.value)} // Update state with new value
                  required
                />
              </div>
              {/* Form buttons */}
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomWorkoutForm;