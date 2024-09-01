import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPresetTemplates, deletePresetTemplate, linkPresetTemplate, fetchPresetWorkoutsForTemplate, unlinkPresetWorkoutFromTemplate,
  fetchUserPresetTemplates, unlinkPresetTemplate as unlinkUserPresetTemplate, } from '../features/presetTemplates/presetTemplateSlice';
import { startWorkoutLog } from '../features/workoutLogs/workoutLogSlice';
import AddPresetTemplateForm from './forms/AddPresetTemplateForm';
import EditPresetTemplateForm from './forms/EditPresetTemplateForm';
import { fetchAccountDetails } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Alert } from 'react-bootstrap';

const PresetTemplate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const templates = useSelector((state) => state.presetTemplates.templates || []);
  const userPresetTemplates = useSelector((state) => state.presetTemplates.userTemplates || []);
  const presetWorkouts = useSelector((state) => state.presetTemplates.presetWorkouts || []);
  const status = useSelector((state) => state.presetTemplates.status);
  const error = useSelector((state) => state.presetTemplates.error);
  const role = useSelector((state) => state.auth.role);
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);
  const [showLinkTemplateModal, setShowLinkTemplateModal] = useState(false);
  const [templateToLink, setTemplateToLink] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const userID = user ? user.userID : null;

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [viewingWorkouts, setViewingWorkouts] = useState(null);
  const [selectedUserTemplateID, setSelectedUserTemplateID] = useState(null);

  // Modal States
  const [showDeleteTemplateModal, setShowDeleteTemplateModal] = useState(false);
  const [showUnlinkWorkoutModal, setShowUnlinkWorkoutModal] = useState(false);
  const [showUnlinkUserTemplateModal, setShowUnlinkUserTemplateModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [workoutToUnlink, setWorkoutToUnlink] = useState({ presetTemplateID: null, presetWorkoutID: null });

  // Filters
  const [daysFilter, setDaysFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [goalFilter, setGoalFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    if (token && !user) {
        console.log('Token available, fetching account details...');
        dispatch(fetchAccountDetails());
    }
  }, [dispatch, token, user]);

  // Fetch account details if token is available but user details are not (bug fix)
  useEffect(() => {
      if (isAuthenticated && userID && status === 'idle') {
          console.log('Fetching templates for user:', userID);
          dispatch(fetchPresetTemplates())
            .unwrap()
            .then(() => dispatch(fetchUserPresetTemplates(userID)));
      }
  }, [dispatch, isAuthenticated, userID, status]);

  // Reload data if status changes to idle after an error (bug fix)
  useEffect(() => {
      if (status === 'idle' && userID) {
          dispatch(fetchPresetTemplates());
          dispatch(fetchUserPresetTemplates(userID));
      }
  }, [status, userID, dispatch]);

  if (!isAuthenticated || status === 'loading') {
    return <div>Loading...</div>;
  }

  // Link preset template to user
  const handleLinkTemplateToUser = (presetTemplateID) => {
    if (!userID) {
      console.error('User ID is not defined. Cannot link preset template to user.');
      return;
    }
    setTemplateToLink(presetTemplateID);
    setShowLinkTemplateModal(true);
  };

  // Confirm linking template to user and handle if already linked
  const handleConfirmLinkTemplate = () => {
    if (!templateToLink) return;

    dispatch(linkPresetTemplate({ userID, presetTemplateID: templateToLink }))
      .unwrap()
      .then(() => {
        dispatch(fetchUserPresetTemplates(userID));
      })
      .catch((error) => {
        if (error.error === 'Preset template is already linked to this user') {
          setAlertMessage('This template is already linked to your account.');
        } else {
          console.error('Error linking preset template:', error);
          setAlertMessage(`Failed to link preset template: ${error.error || 'Unknown error'}`);
        }
        setAlertVisible(true);
      });

    setShowLinkTemplateModal(false);
  };

  // Handle starting workout, re-direct to workout logs page
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

  // Toggle viewing of workouts for a preset template
  const handleViewWorkouts = (presetTemplateID) => {
    if (viewingWorkouts === presetTemplateID) {
      setViewingWorkouts(null);
    } else {
      setViewingWorkouts(presetTemplateID);
      dispatch(fetchPresetWorkoutsForTemplate(presetTemplateID));
    }
  };

  // View user selected preset templates
  const handleViewUserWorkouts = (presetTemplateID) => {
    if (selectedUserTemplateID === presetTemplateID) {
      setSelectedUserTemplateID(null);
    } else {
      setSelectedUserTemplateID(presetTemplateID);
      dispatch(fetchPresetWorkoutsForTemplate(presetTemplateID));
    }
  };

  // Unlink workout for preset template
  const handleUnlinkWorkout = (presetTemplateID, presetWorkoutID) => {
    setWorkoutToUnlink({ presetTemplateID, presetWorkoutID });
    setShowUnlinkWorkoutModal(true);
  };

  // Confirm unlinking workout for preset template
  const handleConfirmUnlinkWorkout = () => {
    const { presetTemplateID, presetWorkoutID } = workoutToUnlink;
    dispatch(unlinkPresetWorkoutFromTemplate({ presetTemplateID, presetWorkoutID }))
      .then(() => {
        dispatch(fetchPresetWorkoutsForTemplate(presetTemplateID));
      });
    setShowUnlinkWorkoutModal(false);
  };

  // Unlink preset template from user
  const handleUnlinkUserTemplate = (presetTemplateID) => {
    setTemplateToDelete(presetTemplateID);
    setShowUnlinkUserTemplateModal(true);
  };

  // Confirm unlinking preset template from user
  const handleConfirmUnlinkUserTemplate = () => {
    dispatch(unlinkUserPresetTemplate({ userID, presetTemplateID: templateToDelete }))
      .unwrap()
      .then(() => {
        dispatch(fetchUserPresetTemplates(userID)); // Refresh user's selected preset templates to update state
        setShowUnlinkUserTemplateModal(false);
      })
      .catch((error) => {
        console.error('Error removing template:', error);
        setShowUnlinkUserTemplateModal(false);
      });
  };

  // Handle editing a template
  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
  };

  // Handle deleting a template
  const handleDeleteTemplate = (presetTemplateID) => {
    setTemplateToDelete(presetTemplateID);
    setShowDeleteTemplateModal(true);
  };

  // Confirm deleting a template
  const handleConfirmDeleteTemplate = () => {
    dispatch(deletePresetTemplate(templateToDelete))
      .unwrap()
      .then(() => {
        setShowDeleteTemplateModal(false);
      })
      .catch((error) => {
        console.error('Error deleting template:', error);
        alert(`Failed to delete template: ${error.message || 'Unknown error'}`);
      });
  };

  // Handle adding a template
  const handleAddTemplate = () => {
    setShowAddForm(true);
  };

  // Render list of workouts associated with a specific preset workout
  const renderPresetWorkouts = () => (
    <ul className="list-group">
      {presetWorkouts.map((workout) => (
        <li key={workout.presetWorkoutID} className="list-group-item d-flex justify-content-between align-items-center">
          {workout.PresetWorkout.presetWorkoutName}
          <button className="btn btn-success btn-sm" onClick={() => handleStartWorkout(workout.presetWorkoutID)}>Start Workout</button>
          {(role === 'admin' || role === 'superadmin') && (
            <button
              className="btn btn-danger btn-sm ms-2"
              onClick={() => handleUnlinkWorkout(viewingWorkouts || selectedUserTemplateID, workout.presetWorkoutID)}
            >
              Unlink
            </button>
          )}
        </li>
      ))}
    </ul>
  );

  // Filtered templates based on the selected filters
  const filteredTemplates = templates.filter((template) => {
    return (
      (daysFilter === '' || template.presetTemplateDays === parseInt(daysFilter)) &&
      (difficultyFilter === '' || template.presetTemplateDifficulty === difficultyFilter) &&
      (goalFilter === '' || template.presetTemplateGoal === goalFilter) &&
      (locationFilter === '' || template.presetTemplateLocation === locationFilter)
    );
  });

  let content;

  if (status === 'loading') {
    content = <p>Loading...</p>;
  } else if (status === 'succeeded') {
    content = (
      <>
        <div className="mb-4">
           {/* Filters for preset tempaltes - days, difficulty, goal, location */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            <div>
              <label>Filter by Days: </label>
              <select className="form-select" value={daysFilter} onChange={(e) => setDaysFilter(e.target.value)}>
                <option value="">All</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
              </select>
            </div>
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

          {/* Display preset templates */}
          <ul className="list-group">
            {filteredTemplates.map((template) => (
              <li key={template.presetTemplateID} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-start">
                    <img
                      src="/images/template.jpg"
                      alt="Template Image"
                      className="img-thumbnail me-3"
                      style={{ width: '100px', height: '100px' }}
                    />
                    <div>
                      <p><strong>Name:</strong> {template.presetTemplateName}</p>
                      <p><strong>Days:</strong> {template.presetTemplateDays}</p>
                      <p><strong>Difficulty:</strong> {template.presetTemplateDifficulty}</p>
                      <p><strong>Weightlifting Goal:</strong> {template.presetTemplateGoal}</p>
                      <p><strong>Location:</strong> {template.presetTemplateLocation}</p>
                    </div>
                  </div>
                  <div>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => handleViewWorkouts(template.presetTemplateID)}>
                      {viewingWorkouts === template.presetTemplateID ? 'Hide Workouts' : 'View Workouts'}
                    </button>
                    {(role === 'admin' || role === 'superadmin') && (
                      <>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditTemplate(template)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTemplate(template.presetTemplateID)}>Delete</button>
                      </>
                    )}
                    {role === 'user' && (
                      <button className="btn btn-secondary btn-sm" onClick={() => handleLinkTemplateToUser(template.presetTemplateID)}>
                        Add to My Templates
                      </button>
                    )}
                  </div>
                </div>
                {/* Display workouts for preset templates */}
                {viewingWorkouts === template.presetTemplateID && presetWorkouts.length > 0 && (
                  <ul className="list-group mt-3">
                    {presetWorkouts.map((workout) => (
                      <li key={workout.presetWorkoutID} className="list-group-item d-flex justify-content-between align-items-center">
                        {workout.PresetWorkout.presetWorkoutName}
                        {(role === 'admin' || role === 'superadmin') && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              handleUnlinkWorkout(template.presetTemplateID, workout.presetWorkoutID)
                            }
                          >
                            Remove
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* My Selected Preset Templates - Only for user role */}
        {role === 'user' && (
        <>
          <h3>My Selected Preset Templates</h3>
          {userPresetTemplates.length > 0 ? (
            <ul className="list-group">
              {userPresetTemplates.map((template) => (
                <li key={template.presetTemplateID} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-start">
                      <img
                        src="/images/template.jpg"
                        alt="Template Image"
                        className="img-thumbnail me-3"
                        style={{ width: '100px', height: '100px' }}
                      />
                      <div>
                        <p><strong>Name:</strong> {template.presetTemplateName}</p>
                        <p><strong>Days:</strong> {template.presetTemplateDays}</p>
                        <p><strong>Difficulty:</strong> {template.presetTemplateDifficulty}</p>
                        <p><strong>Weightlifting Goal:</strong> {template.presetTemplateGoal}</p>
                        <p><strong>Location:</strong> {template.presetTemplateLocation}</p>
                      </div>
                    </div>
                    <div>
                      <button className="btn btn-primary btn-sm me-2" onClick={() => handleViewUserWorkouts(template.presetTemplateID)}>
                        {selectedUserTemplateID === template.presetTemplateID ? 'Hide Workouts' : 'View Workouts'}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleUnlinkUserTemplate(template.presetTemplateID)}>
                        Remove from My Templates
                      </button>
                    </div>
                  </div>
                  {selectedUserTemplateID === template.presetTemplateID && renderPresetWorkouts()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No selected preset templates found.</p>
          )}
        </>
      )}
      </>
    );
  } else if (status === 'failed') {
    content = (
      <p>
        {typeof error === 'string'
          ? error
          : error?.message || 'An unknown error occurred.'}
      </p>
    );
  }

  return (
    <section className="container mt-4">

      {alertVisible && (
    <Alert variant="danger" onClose={() => setAlertVisible(false)} dismissible>
      {alertMessage}
    </Alert>
      )}

      <h2>Preset Templates</h2>
      {(role === 'admin' || role === 'superadmin') && (
        <button className="btn btn-success mb-4" onClick={handleAddTemplate}>Add Preset Template</button>
      )}
      {content}
      {showAddForm && <AddPresetTemplateForm onClose={() => setShowAddForm(false)} />}
      {editingTemplate && (
        <EditPresetTemplateForm
          template={editingTemplate}
          onClose={() => setEditingTemplate(null)}
        />
      )}

      {/* Delete Template Modal */}
      <Modal show={showDeleteTemplateModal} onHide={() => setShowDeleteTemplateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Delete this template?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteTemplateModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirmDeleteTemplate}>Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* Unlink Workout Modal */}
      <Modal show={showUnlinkWorkoutModal} onHide={() => setShowUnlinkWorkoutModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Remove Workout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Remove this workout from the template?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUnlinkWorkoutModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirmUnlinkWorkout}>Remove</Button>
        </Modal.Footer>
      </Modal>

      {/* Unlink User Template Modal */}
      <Modal show={showUnlinkUserTemplateModal} onHide={() => setShowUnlinkUserTemplateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Remove Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove this template from your favourites?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUnlinkUserTemplateModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirmUnlinkUserTemplate}>Remove</Button>
        </Modal.Footer>
      </Modal>

      {/* Link Template Modal */}
      <Modal show={showLinkTemplateModal} onHide={() => setShowLinkTemplateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Add Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>Add this template to your favourites?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLinkTemplateModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleConfirmLinkTemplate}>Add</Button>
        </Modal.Footer>
      </Modal>

    </section>
  );
};

export default PresetTemplate;