import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPresetWorkouts,
  fetchExercisesForPresetWorkout,
  unlinkExerciseFromPresetWorkout,
  deletePresetWorkout,
  linkPresetWorkoutToUser,
  fetchUserPresetWorkouts,
  unlinkPresetWorkoutFromUser,
} from '../features/presetWorkouts/presetWorkoutSlice';
import {
  fetchPresetTemplates,
  linkPresetWorkoutToTemplate as linkWorkoutToPresetTemplate,
} from '../features/presetTemplates/presetTemplateSlice';
import {
  fetchUserCustomTemplates,
  linkPresetWorkoutToTemplate as linkWorkoutToCustomTemplate,
} from '../features/customTemplates/customTemplateSlice';
import { startWorkoutLog } from '../features/workoutLogs/workoutLogSlice';
import AddPresetWorkoutForm from './forms/AddPresetWorkoutForm';
import EditPresetWorkoutForm from './forms/EditPresetWorkoutForm';
import { fetchAccountDetails } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Alert } from 'react-bootstrap';

const PresetWorkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const workouts = useSelector((state) => state.presetWorkouts.workouts);
  const exercises = useSelector((state) => state.presetWorkouts.exercises);
  const templates = useSelector((state) => state.presetTemplates.templates);
  const customTemplates = useSelector((state) => state.customTemplates.templates);
  const userPresetWorkouts = useSelector((state) => state.presetWorkouts.userWorkouts);
  const status = useSelector((state) => state.presetWorkouts.status);
  const userPresetStatus = useSelector((state) => state.presetWorkouts.status);
  const error = useSelector((state) => state.presetWorkouts.error);
  const role = useSelector((state) => state.auth.role);
  const user = useSelector((state) => state.auth.user);
  const userID = user ? user.userID : null;

  const [mainSelectedWorkoutID, setMainSelectedWorkoutID] = useState(null);
  const [selectedPresetWorkoutID, setSelectedPresetWorkoutID] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [selectedPresetTemplateID, setSelectedPresetTemplateID] = useState('');
  const [selectedCustomTemplateID, setSelectedCustomTemplateID] = useState('');
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Filters
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [goalFilter, setGoalFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUnlinkExerciseModal, setShowUnlinkExerciseModal] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);
  const [exerciseToUnlink, setExerciseToUnlink] = useState({ presetWorkoutID: null, exerciseID: null });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmModalMessage, setConfirmModalMessage] = useState('');
  const [confirmModalTitle, setConfirmModalTitle] = useState(''); 

  const [showUnlinkPresetModal, setShowUnlinkPresetModal] = useState(false);
  const [presetWorkoutToUnlink, setPresetWorkoutToUnlink] = useState(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState(''); 

  useEffect(() => {
    if (!user) {
      dispatch(fetchAccountDetails()).finally(() => setInitialLoadComplete(true));
    } else {
      setInitialLoadComplete(true);
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user && userID) {
      if (status === 'idle') {
        dispatch(fetchPresetWorkouts());
        dispatch(fetchPresetTemplates());
        if (role === 'user') {
          dispatch(fetchUserCustomTemplates());
          dispatch(fetchUserPresetWorkouts(userID));
        }
      }
    }
  }, [status, dispatch, user, userID, role]);

  const handleViewMainExercises = (presetWorkoutID) => {
    setMainSelectedWorkoutID(prevID => prevID === presetWorkoutID ? null : presetWorkoutID);
    dispatch(fetchExercisesForPresetWorkout(presetWorkoutID));
  };

  const handleViewSelectedExercises = (presetWorkoutID) => {
    setSelectedPresetWorkoutID(prevID => prevID === presetWorkoutID ? null : presetWorkoutID);
    dispatch(fetchExercisesForPresetWorkout(presetWorkoutID));
  };

  const handleLinkWorkoutToUser = (presetWorkoutID) => {
    if (!userID) {
      console.error('User ID is not defined. Cannot link preset workout to user.');
      return;
    }
  
    setConfirmModalTitle('Confirm Action');
    setConfirmModalMessage('Add this workout to your favourites?');
    setConfirmAction(() => () => {
      dispatch(linkPresetWorkoutToUser({ userID, presetWorkoutID }))
        .unwrap()
        .then(() => {
          dispatch(fetchUserPresetWorkouts(userID));
        })
        .catch((error) => {
          console.error('Error linking preset workout:', error);
          if (error.error === 'Preset workout is already linked to this user') {
            setAlertMessage('This workout is already in your favourites.');
          } else {
            setAlertMessage(`Failed to link preset workout: ${error.message || 'Unknown error'}`);
          }
          setAlertVariant('danger');
          setAlertVisible(true);
        });
    });
    setShowConfirmModal(true);
  };

  const handleStartWorkout = (workoutID) => {
    dispatch(startWorkoutLog({ presetWorkoutID: workoutID }))
      .unwrap()
      .then(() => {
        navigate('/workout-logs');
      })
      .catch((error) => {
        console.error('Error starting workout:', error);
        alert('Failed to start workout. Please try again.');
      });
  };

  const handleUnlinkPresetWorkout = (presetWorkoutID) => {
    setPresetWorkoutToUnlink(presetWorkoutID);
    setConfirmModalTitle('Confirm Unlink');
    setConfirmModalMessage('Are you sure you want to remove this workout from your favourites?');
    setConfirmAction(() => () => {
      dispatch(unlinkPresetWorkoutFromUser({ userID, presetWorkoutID }))
        .unwrap()
        .then(() => {
          dispatch(fetchUserPresetWorkouts(userID));
        })
        .catch((error) => {
          console.error('Error removing workout:', error);
        });
    });
    setShowConfirmModal(true);
  };

  const handleUnlinkExercise = (presetWorkoutID, exerciseID) => {
    setExerciseToUnlink({ presetWorkoutID, exerciseID });
    setShowUnlinkExerciseModal(true);
  };

  const handleConfirmUnlinkExercise = () => {
    const { presetWorkoutID, exerciseID } = exerciseToUnlink;
    dispatch(unlinkExerciseFromPresetWorkout({ presetWorkoutID, exerciseID }));
    setShowUnlinkExerciseModal(false);
  };

  const handleAddWorkout = () => {
    setShowAddForm(true);
  };

  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
  };

  const handleDeleteWorkout = (presetWorkoutID) => {
    setWorkoutToDelete(presetWorkoutID);
    setShowDeleteModal(true);
  };

  const handleConfirmDeleteWorkout = () => {
    dispatch(deletePresetWorkout(workoutToDelete))
      .unwrap()
      .then(() => {
        setShowDeleteModal(false);
      })
      .catch((error) => {
        console.error('Error deleting workout:', error);
        alert(`Failed to delete workout: ${error.message || 'Unknown error'}`);
      });
  };

  const handleLinkWorkoutToTemplate = (presetWorkoutID, presetTemplateID) => {
    if (presetTemplateID) {
      setConfirmModalTitle('Confirm Action');
      setConfirmModalMessage('Add this workout to the selected preset template?');
      setConfirmAction(() => () => {
        dispatch(linkWorkoutToPresetTemplate({ presetTemplateID, presetWorkoutID }))
          .unwrap()
          .then(() => {
            setSelectedPresetTemplateID('');
            setAlertMessage('Preset workout linked to template successfully.');
            setAlertVariant('success');
            setAlertVisible(true);
          })
          .catch((error) => {
            console.error('Error linking preset workout:', error);
            setAlertMessage(`Failed to link preset workout: ${error.error || 'Unknown error'}`);
            setAlertVariant('danger');
            setAlertVisible(true);
          });
      });
      setShowConfirmModal(true);
    }
  };

  const handleLinkWorkoutToCustomTemplate = (presetWorkoutID, customTemplateID) => {
    if (customTemplateID) {
      setConfirmModalTitle('Confirm Action');
      setConfirmModalMessage('Add this workout to the selected custom template?');
      setConfirmAction(() => () => {
        dispatch(linkWorkoutToCustomTemplate({ id: customTemplateID, presetWorkoutID }))
          .unwrap()
          .then(() => {
            setSelectedCustomTemplateID('');
            setAlertMessage('Preset workout linked to custom template successfully.');
            setAlertVariant('success');
            setAlertVisible(true);
          })
          .catch((error) => {
            console.error('Error linking preset workout:', error);
            if (error === 'Preset workout is already linked to this custom template') {
              setAlertMessage('This workout is already linked to the selected template.');
            } else {
              setAlertMessage(`Failed to link preset workout: ${error.error || 'Unknown error'}`);
            }
            setAlertVariant('danger');
            setAlertVisible(true);
          });
      });
      setShowConfirmModal(true);
    }
  };

  const filteredWorkouts = workouts.filter((workout) => {
    return (
      (difficultyFilter === '' || workout.presetWorkoutDifficulty === difficultyFilter) &&
      (goalFilter === '' || workout.presetWorkoutGoal === goalFilter) &&
      (locationFilter === '' || workout.presetWorkoutLocation === locationFilter)
    );
  });

  let content;

  if (status === 'loading') {
    content = <p>Loading...</p>;
  } else if (status === 'succeeded') {
    content = (
      <>
        <div className="mb-4">
          <div className="d-flex flex-wrap gap-2 mb-3">
            <div>
              <label>Filter by Difficulty: </label>
              <select className="form-select" value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
                <option value="">All</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label>Filter by Goal: </label>
              <select className="form-select" value={goalFilter} onChange={(e) => setGoalFilter(e.target.value)}>
                <option value="">All</option>
                <option value="Size">Muscle Size</option>
                <option value="Strength">Muscle Strength</option>
                <option value="Overall">Strength & Size</option>
              </select>
            </div>
            <div>
              <label>Filter by Location: </label>
              <select className="form-select" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                <option value="">All</option>
                <option value="Home">Home</option>
                <option value="Gym">Gym</option>
              </select>
            </div>
          </div>

          <ul className="list-group">
            {filteredWorkouts.map((workout) => (
              <li key={workout.presetWorkoutID} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-start">
                    <img
                      src="/images/workout.jpg"
                      alt="Workout Image"
                      className="img-thumbnail me-3"
                      style={{ width: '100px', height: '100px' }}
                    />
                    <div>
                      <p><strong>Name:</strong> {workout.presetWorkoutName}</p>
                      <p><strong>Difficulty:</strong> {workout.presetWorkoutDifficulty}</p>
                      <p><strong>Weightlifting Goal:</strong> {workout.presetWorkoutGoal}</p>
                      <p><strong>Location:</strong> {workout.presetWorkoutLocation}</p>
                    </div>
                  </div>
                  <div>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => handleViewMainExercises(workout.presetWorkoutID)}>
                      {mainSelectedWorkoutID === workout.presetWorkoutID ? 'Hide Exercises' : 'View Exercises'}
                    </button>
                    {(role === 'admin' || role === 'superadmin') && (
                      <>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditWorkout(workout)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteWorkout(workout.presetWorkoutID)}>Delete</button>
                        <select
                          className="form-select mt-2"
                          value={selectedPresetTemplateID}
                          onChange={(e) => {
                            setSelectedPresetTemplateID(e.target.value);
                            handleLinkWorkoutToTemplate(workout.presetWorkoutID, e.target.value);
                          }}
                        >
                          <option value="">Add To Preset Template</option>
                          {templates.map((template) => (
                            <option key={template.presetTemplateID} value={template.presetTemplateID}>
                              {template.presetTemplateName}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                    {role === 'user' && (
                      <button className="btn btn-secondary btn-sm" onClick={() => handleLinkWorkoutToUser(workout.presetWorkoutID)}>
                        Add to My Workouts
                      </button>
                    )}
                  </div>
                </div>
                {mainSelectedWorkoutID === workout.presetWorkoutID && exercises[workout.presetWorkoutID] && (
                  <ul className="list-group mt-3">
                    {exercises[workout.presetWorkoutID].length > 0 ? (
                      exercises[workout.presetWorkoutID].map((exercise) => (
                        <li key={exercise.exerciseID} className="list-group-item d-flex justify-content-between align-items-center">
                          {exercise.Exercise.exerciseName} - {exercise.Exercise.exerciseBodypart}
                          {(role === 'admin' || role === 'superadmin') && (
                            <button className="btn btn-danger btn-sm" onClick={() => handleUnlinkExercise(workout.presetWorkoutID, exercise.exerciseID)}>
                              Remove
                            </button>
                          )}
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
        </div>

        {/* My Selected Preset Workouts - Only for user role */}
        {role === 'user' && (
          <>
            <h3>My Selected Preset Workouts</h3>
            {userPresetStatus === 'loading' ? (
              <p>Loading your selected workouts...</p>
            ) : userPresetWorkouts.length > 0 ? (
              <ul className="list-group">
                {userPresetWorkouts.map((workout) => (
                  <li key={workout.presetWorkoutID} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-start">
                        <img
                          src="/images/workout.jpg"
                          alt="Workout Image"
                          className="img-thumbnail me-3"
                          style={{ width: '100px', height: '100px' }}
                        />
                        <div>
                          <p><strong>Name:</strong> {workout.presetWorkoutName}</p>
                          <p><strong>Difficulty:</strong> {workout.presetWorkoutDifficulty}</p>
                          <p><strong>Weightlifting Goal:</strong> {workout.presetWorkoutGoal}</p>
                          <p><strong>Location:</strong> {workout.presetWorkoutLocation}</p>
                        </div>
                      </div>
                      <div>
                        <button className="btn btn-primary btn-sm me-2" onClick={() => handleViewSelectedExercises(workout.presetWorkoutID)}>
                          {selectedPresetWorkoutID === workout.presetWorkoutID ? 'Hide Exercises' : 'View Exercises'}
                        </button>
                        <button className="btn btn-success btn-sm me-2" onClick={() => handleStartWorkout(workout.presetWorkoutID)}>
                          Start Workout
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleUnlinkPresetWorkout(workout.presetWorkoutID)}>
                          Remove
                        </button>
                        <select
                          className="form-select mt-2"
                          value={selectedCustomTemplateID}
                          onChange={(e) => {
                            setSelectedCustomTemplateID(e.target.value);
                            handleLinkWorkoutToCustomTemplate(workout.presetWorkoutID, e.target.value);
                          }}
                        >
                          <option value="">Select Custom Template</option>
                          {customTemplates.map((template) => (
                            <option key={template.customTemplateID} value={template.customTemplateID}>
                              {template.customTemplateName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {selectedPresetWorkoutID === workout.presetWorkoutID && exercises[workout.presetWorkoutID] && (
                      <ul className="list-group mt-3">
                        {exercises[workout.presetWorkoutID].length > 0 ? (
                          exercises[workout.presetWorkoutID].map((exercise) => (
                            <li key={exercise.exerciseID} className="list-group-item">
                              {exercise.Exercise.exerciseName} - {exercise.Exercise.exerciseBodypart}
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
            ) : (
              <p>No selected preset workouts found.</p>
            )}
          </>
        )}
      </>
    );
  } else if (status === 'failed') {
    content = (
      <p>
        {typeof error === 'string' ? error : error.message || 'An error occurred.'}
      </p>
    );
  }

  return (
    <section className="container mt-4">
      <h2>Preset Workouts</h2>

      {user && role && (
        <>
          {(role === 'admin' || role === 'superadmin') && (
            <button className="btn btn-success mb-4" onClick={handleAddWorkout}>Add Preset Workout</button>
          )}
          {content}
          {showAddForm && <AddPresetWorkoutForm onClose={() => setShowAddForm(false)} />}
          {editingWorkout && (
            <EditPresetWorkoutForm workout={editingWorkout} onClose={() => setEditingWorkout(null)} />
          )}
        </>
      )}

      {!user && <p>Loading user data...</p>}

      {/* Delete Workout Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Delete this workout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirmDeleteWorkout}>Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* Unlink Exercise Modal */}
      <Modal show={showUnlinkExerciseModal} onHide={() => setShowUnlinkExerciseModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Remove Exercise</Modal.Title>
        </Modal.Header>
        <Modal.Body>Remove this exercise from the workout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUnlinkExerciseModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirmUnlinkExercise}>Remove</Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Action Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{confirmModalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{confirmModalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => { confirmAction(); setShowConfirmModal(false); }}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Unlink Preset Workout Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{confirmModalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{confirmModalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => { confirmAction(); setShowConfirmModal(false); }}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Action Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{confirmModalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{confirmModalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => { confirmAction(); setShowConfirmModal(false); }}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

          {/* Alert Message */}
          {alertVisible && (
            <Alert variant={alertVariant} onClose={() => setAlertVisible(false)} dismissible>
              {alertMessage}
            </Alert>
          )}

    </section>
  );
};

export default PresetWorkout;