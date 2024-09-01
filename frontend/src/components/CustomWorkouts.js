import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchUserCustomWorkouts,
  fetchExercisesForCustomWorkout,
  unlinkExerciseFromCustomWorkout,
  deleteCustomWorkout,
} from '../features/customWorkouts/customWorkoutSlice';
import {
  fetchUserCustomTemplates,
  linkCustomWorkoutToTemplate,
} from '../features/customTemplates/customTemplateSlice';
import AddCustomWorkoutForm from './forms/AddCustomWorkoutForm';
import EditCustomWorkoutForm from './forms/EditCustomWorkoutForm';
import { startWorkoutLog } from '../features/workoutLogs/workoutLogSlice';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Alert } from 'react-bootstrap'; // Import Bootstrap components

const CustomWorkouts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const workouts = useSelector((state) => state.customWorkouts.workouts);
  const exercises = useSelector((state) => state.customWorkouts.exercises);
  const templates = useSelector((state) => state.customTemplates.templates);
  const status = useSelector((state) => state.customWorkouts.status);
  const error = useSelector((state) => state.customWorkouts.error);

  const [selectedWorkoutID, setSelectedWorkoutID] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [selectedTemplateID, setSelectedTemplateID] = useState('');
  const [showUnlinkModal, setShowUnlinkModal] = useState(false); // Modal state
  const [exerciseToUnlink, setExerciseToUnlink] = useState(null); // Exercise to unlink
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal state
  const [workoutToDelete, setWorkoutToDelete] = useState(null); 
  const [showLinkModal, setShowLinkModal] = useState(false); // Modal state for linking
  const [workoutToLink, setWorkoutToLink] = useState(null); // Workout ID to link
  const [linkResult, setLinkResult] = useState(null); // Link result status (success or failure)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUserCustomWorkouts());
      dispatch(fetchUserCustomTemplates());
    }
  }, [status, dispatch]);

  const handleViewExercises = (customWorkoutID) => {
    if (selectedWorkoutID === customWorkoutID) {
      // If the clicked workout is already selected, hide the exercises by resetting the selectedWorkoutID
      setSelectedWorkoutID(null);
    } else {
      // Otherwise, fetch and display the exercises for the clicked workout
      setSelectedWorkoutID(customWorkoutID);
      dispatch(fetchExercisesForCustomWorkout(customWorkoutID));
    }
  };

  const handleOpenUnlinkModal = (exerciseID) => {
    setExerciseToUnlink(exerciseID);
    setShowUnlinkModal(true);
  };

  const handleUnlinkExercise = () => {
    dispatch(unlinkExerciseFromCustomWorkout({ customWorkoutID: selectedWorkoutID, exerciseID: exerciseToUnlink }));
    setShowUnlinkModal(false);
  };

  const handleOpenDeleteModal = (customWorkoutID) => {
    setWorkoutToDelete(customWorkoutID);
    setShowDeleteModal(true);
  };

  const handleDeleteWorkout = () => {
    if (workoutToDelete) {
      dispatch(deleteCustomWorkout(workoutToDelete))
        .unwrap()
        .then(() => {
          setShowDeleteModal(false); // Close the modal after successful deletion
          setWorkoutToDelete(null); // Clear the workout ID to avoid accidental re-use
        })
        .catch((error) => {
          console.error('Error deleting workout:', error);
          alert(`Failed to delete workout: ${error.message || 'Unknown error'}`);
        });
    }
  };

  const handleAddWorkout = () => {
    setShowAddForm(true);
  };

  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
  };

  const handleOpenLinkModal = (customWorkoutID, templateID) => {
    setWorkoutToLink({ customWorkoutID, templateID });
    setShowLinkModal(true);
  };

  const handleLinkWorkoutToTemplate = () => {
    if (workoutToLink) {
      const { customWorkoutID, templateID } = workoutToLink;
      dispatch(linkCustomWorkoutToTemplate({ id: templateID, customWorkoutID }))
        .unwrap()
        .then(() => {
          setShowLinkModal(false); // Close the modal after successful link
          setLinkResult({ success: true, message: 'Custom workout linked to template successfully.' });
          setSelectedTemplateID('');
        })
        .catch((error) => {
          setLinkResult({ success: false, message: error.error === 'Custom workout is already linked to this template' ? 'This workout is already linked to the selected template.' : `Failed to link custom workout: ${error || 'Unknown error'}` });
          setShowLinkModal(false);
        });
    }
  };

  const handleStartWorkout = (workoutID) => {
    dispatch(startWorkoutLog({ customWorkoutID: workoutID }))
      .unwrap()
      .then(() => {
        navigate('/workout-logs');
      })
      .catch((error) => {
        console.error('Error starting workout:', error);
        alert('Failed to start workout. Please try again.');
      });
  };

  let content;

  if (status === 'loading') {
    content = <p>Loading...</p>;
  } else if (status === 'succeeded') {
    content = (
      <ul className="list-group">
        {workouts.map((workout) => (
          <li key={workout.customWorkoutID} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-start">
                <img
                  src="/images/workout.jpg"
                  alt="Workout Image"
                  className="img-thumbnail me-3"
                  style={{ width: '100px', height: '100px' }}
                />
                <div>
                  <p><strong>Name:</strong> {workout.customWorkoutName}</p>
                </div>
              </div>
              <div>
                <button 
                  className="btn btn-primary btn-sm me-2" 
                  onClick={() => handleViewExercises(workout.customWorkoutID)}
                >
                  {selectedWorkoutID === workout.customWorkoutID ? 'Hide Exercises' : 'View Exercises'}
                </button>
                <button 
                  className="btn btn-warning btn-sm me-2" 
                  onClick={() => handleEditWorkout(workout)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-danger btn-sm me-2" 
                  onClick={() => handleOpenDeleteModal(workout.customWorkoutID)}
                >
                  Delete
                </button>
                <button 
                  className="btn btn-success btn-sm" 
                  onClick={() => handleStartWorkout(workout.customWorkoutID)}
                >
                  Start Workout
                </button>
                <select
                  className="form-select mt-2"
                  value={selectedTemplateID}
                  onChange={(e) => {
                    setSelectedTemplateID(e.target.value);
                    handleOpenLinkModal(workout.customWorkoutID, e.target.value);
                  }}
                >
                  <option value="">Add to Custom Template</option>
                  {templates.map((template) => (
                    <option key={template.customTemplateID} value={template.customTemplateID}>
                      {template.customTemplateName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {selectedWorkoutID === workout.customWorkoutID && exercises[workout.customWorkoutID] && (
              <ul className="list-group mt-3">
                {exercises[workout.customWorkoutID].length > 0 ? (
                  exercises[workout.customWorkoutID].map((exercise) => (
                    <li key={exercise.exerciseID} className="list-group-item">
                      {exercise.Exercise.exerciseName} - {exercise.Exercise.exerciseBodypart}
                      <button 
                        className="btn btn-danger btn-sm float-end" 
                        onClick={() => handleOpenUnlinkModal(exercise.exerciseID)}
                      >
                        Remove
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">No Exercises Added</li>
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  } else if (status === 'failed') {
    content = <p className="text-danger">{error || 'An error occurred'}</p>;
  }

  return (
    <section className="container mt-4">
      <h2 className="mb-4">My Custom Workouts</h2>
      <button className="btn btn-primary mb-3" onClick={handleAddWorkout}>Add Custom Workout</button>
      {content}
      {showAddForm && <AddCustomWorkoutForm onClose={() => setShowAddForm(false)} />}
      {editingWorkout && (
        <EditCustomWorkoutForm workout={editingWorkout} onClose={() => setEditingWorkout(null)} />
      )}

      {/* Unlink Exercise Modal */}
      <Modal show={showUnlinkModal} onHide={() => setShowUnlinkModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Remove Exercise</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove this exercise from the workout?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUnlinkModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleUnlinkExercise}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this workout? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteWorkout}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Link to Template Confirmation Modal */}
      <Modal show={showLinkModal} onHide={() => setShowLinkModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Add</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Add this workout to the selected template?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLinkModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleLinkWorkoutToTemplate}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Link Result Alert */}
      {linkResult && (
        <Alert 
          variant={linkResult.success ? 'success' : 'danger'} 
          onClose={() => setLinkResult(null)} 
          dismissible
          className="mt-3"
        >
          {linkResult.message}
        </Alert>
      )}

    </section>
  );
};

export default CustomWorkouts;