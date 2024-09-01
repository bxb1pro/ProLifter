import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCustomWorkout, fetchUserCustomWorkouts } from '../../features/customWorkouts/customWorkoutSlice';

const AddCustomWorkoutForm = ({ onClose }) => {
  const [customWorkoutName, setCustomWorkoutName] = useState('');
  const dispatch = useDispatch();

    // Handle form submission to create new custom workout
  const handleSubmit = (e) => {
    e.preventDefault();
    if (customWorkoutName) {
      dispatch(createCustomWorkout({ customWorkoutName })).then(() => {
        // Refetch the workouts after they're added to update state
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
            <h5 className="modal-title">Add Custom Workout</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Input for workout name */}
              <div className="mb-3">
                <label htmlFor="customWorkoutName" className="form-label">Workout Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="customWorkoutName"
                  value={customWorkoutName}
                  onChange={(e) => setCustomWorkoutName(e.target.value)}
                  required
                />
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

export default AddCustomWorkoutForm;