import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserWorkoutLogs, deleteWorkoutLog } from '../features/workoutLogs/workoutLogSlice';
import { fetchUserCustomWorkouts } from '../features/customWorkouts/customWorkoutSlice';
import { fetchPresetWorkouts } from '../features/presetWorkouts/presetWorkoutSlice';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const WorkoutLogs = () => {
  const dispatch = useDispatch();
  const workoutLogs = useSelector((state) => state.workoutLogs.logs);
  const workoutLogStatus = useSelector((state) => state.workoutLogs.status);
  const error = useSelector((state) => state.workoutLogs.error);
  
  const customWorkouts = useSelector((state) => state.customWorkouts.workouts); // Access custom workouts
  const presetWorkouts = useSelector((state) => state.presetWorkouts.workouts); // Access preset workouts

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchUserWorkoutLogs());
    dispatch(fetchUserCustomWorkouts()); // Fetch custom workouts
    dispatch(fetchPresetWorkouts()); // Fetch preset workouts
  }, [dispatch]);

  const handleOpenDeleteModal = (workoutLogID) => {
    setLogToDelete(workoutLogID);
    setShowDeleteModal(true);
  };

  const handleDeleteWorkoutLog = () => {
    if (logToDelete) {
      dispatch(deleteWorkoutLog(logToDelete))
        .unwrap()
        .then(() => {
          setShowDeleteModal(false);
          setLogToDelete(null);
        })
        .catch((error) => {
          console.error('Error deleting workout log:', error);
          alert('Failed to delete workout log. Please try again.');
        });
    }
  };

  const getWorkoutName = (presetWorkoutID, customWorkoutID) => {
    if (customWorkoutID) {
      const workout = customWorkouts.find(workout => workout.customWorkoutID === customWorkoutID);
      return workout ? workout.customWorkoutName : 'Custom Workout';
    } else if (presetWorkoutID) {
      const workout = presetWorkouts.find(workout => workout.presetWorkoutID === presetWorkoutID);
      return workout ? workout.presetWorkoutName : 'Preset Workout';
    }
    return 'Workout';
  };

  const startedLogs = workoutLogs.filter(log => !log.workoutLogCompleted);
  const finishedLogs = workoutLogs.filter(log => log.workoutLogCompleted);

  let content;

  if (workoutLogStatus === 'loading') {
    content = <p>Loading...</p>;
  } else if (workoutLogStatus === 'succeeded') {
    content = (
      <>
        <section>
          <h3>Started Workouts</h3>
          {startedLogs.length > 0 ? (
            <ul className="list-group">
              {startedLogs.map((log) => (
                <li key={log.workoutLogID} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-start">
                      <img
                        src="/images/log.jpg"
                        alt="Log Image"
                        className="img-thumbnail me-3"
                        style={{ width: '100px', height: '100px' }}
                      />
                      <div>
                        <Link 
                          to={`/workout-logs/${log.workoutLogID}`} 
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <p><strong>Log:</strong> {getWorkoutName(log.presetWorkoutID, log.customWorkoutID)}</p>
                          <p><strong>Date:</strong> {new Date(log.workoutLogDate).toLocaleDateString()}</p>
                        </Link>
                      </div>
                    </div>
                    <div>
                      <button 
                        className="btn btn-danger btn-sm me-2" 
                        onClick={() => handleOpenDeleteModal(log.workoutLogID)}
                      >
                        Delete Workout
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No started workouts found.</p>
          )}
        </section>

        <section className="mt-4">
          <h3>Finished Workouts</h3>
          {finishedLogs.length > 0 ? (
            <ul className="list-group">
              {finishedLogs.map((log) => (
                <li key={log.workoutLogID} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-start">
                      <img
                        src="/images/log.jpg"
                        alt="Log Image"
                        className="img-thumbnail me-3"
                        style={{ width: '100px', height: '100px' }}
                      />
                      <div>
                        <Link 
                          to={`/workout-logs/${log.workoutLogID}`} 
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <p><strong>Log:</strong> {getWorkoutName(log.presetWorkoutID, log.customWorkoutID)}</p>
                          <p><strong>Date:</strong> {new Date(log.workoutLogDate).toLocaleDateString()}</p>
                        </Link>
                      </div>
                    </div>
                    <div>
                      <button 
                        className="btn btn-danger btn-sm me-2" 
                        onClick={() => handleOpenDeleteModal(log.workoutLogID)}
                      >
                        Delete Workout
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No finished workouts found.</p>
          )}
        </section>
      </>
    );
  } else if (workoutLogStatus === 'failed') {
    content = <p className="text-danger">{error?.message || 'Failed to load workout logs.'}</p>;
  }

  return (
    <section className="container mt-4">
      <h2 className="mb-4">My Workout Logs</h2>
      {content}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete Workout Log</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this workout log? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteWorkoutLog}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default WorkoutLogs;