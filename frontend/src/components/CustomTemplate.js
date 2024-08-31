import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchUserCustomTemplates,
  deleteCustomTemplate,
  fetchCustomWorkoutsForTemplate,
  fetchPresetWorkoutsForTemplate,
  unlinkCustomWorkoutFromTemplate,
  unlinkPresetWorkoutFromTemplate,
} from '../features/customTemplates/customTemplateSlice';
import { startWorkoutLog } from '../features/workoutLogs/workoutLogSlice';
import AddCustomTemplateForm from './forms/AddCustomTemplateForm';
import EditCustomTemplateForm from './forms/EditCustomTemplateForm';
import { fetchAccountDetails } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const CustomTemplate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const templates = useSelector((state) => state.customTemplates.templates);
  const customWorkouts = useSelector((state) => state.customTemplates.customWorkouts);
  const presetWorkouts = useSelector((state) => state.customTemplates.presetWorkouts);
  const status = useSelector((state) => state.customTemplates.status);
  const error = useSelector((state) => state.customTemplates.error);

  const user = useSelector((state) => state.auth.user);

  const [selectedTemplateID, setSelectedTemplateID] = useState(null);
  const [showWorkouts, setShowWorkouts] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false); // Modal state
  const [workoutToRemove, setWorkoutToRemove] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal state for deleting template
  const [templateToDelete, setTemplateToDelete] = useState(null); 

  useEffect(() => {
    if (!user) {
      dispatch(fetchAccountDetails()); // Fetch user details if not already available
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUserCustomTemplates());
    }
  }, [status, dispatch]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const handleAddTemplate = () => {
    setShowAddForm(true);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
  };

  const handleOpenDeleteModal = (customTemplateID) => {
    setTemplateToDelete(customTemplateID);
    setShowDeleteModal(true);
  };

  const handleDeleteTemplate = () => {
    if (templateToDelete) {
      dispatch(deleteCustomTemplate(templateToDelete))
        .unwrap()
        .then(() => {
          setShowDeleteModal(false); // Close the modal after deletion
          setTemplateToDelete(null); // Clear the template ID
        })
        .catch((error) => {
          console.error('Error deleting template:', error);
          alert(`Failed to delete template: ${error.message || 'Unknown error'}`);
        });
    }
  };

  const handleShowWorkouts = (templateID) => {
    setSelectedTemplateID(templateID);
    dispatch(fetchCustomWorkoutsForTemplate(templateID));
    dispatch(fetchPresetWorkoutsForTemplate(templateID));
    setShowWorkouts(!showWorkouts); // Toggle the view
  };

  const handleOpenRemoveModal = (templateID, workoutID, workoutType) => {
    setWorkoutToRemove({ templateID, workoutID, workoutType });
    setShowRemoveModal(true);
  };

  const handleRemoveWorkout = () => {
    if (workoutToRemove) {
      const { templateID, workoutID, workoutType } = workoutToRemove;

      if (workoutType === 'Custom') {
        dispatch(unlinkCustomWorkoutFromTemplate({ id: templateID, customWorkoutID: workoutID }))
          .then(() => {
            // Refresh workouts after removing
            dispatch(fetchCustomWorkoutsForTemplate(templateID));
          });
      } else if (workoutType === 'Preset') {
        dispatch(unlinkPresetWorkoutFromTemplate({ id: templateID, presetWorkoutID: workoutID }))
          .then(() => {
            // Refresh workouts after removing
            dispatch(fetchPresetWorkoutsForTemplate(templateID));
          });
      }
      
      setShowRemoveModal(false); // Close the modal after removing
    }
  };

  const handleStartWorkout = (workoutID, workoutType) => {
    if (workoutType === 'Custom') {
        dispatch(startWorkoutLog({ customWorkoutID: workoutID }))
            .unwrap()
            .then(() => {
                navigate('/workout-logs'); // Redirect to the workout logs page after starting the workout
            })
            .catch((error) => {
                console.error('Error starting workout:', error);
                alert('Failed to start workout. Please try again.');
            });
    } else if (workoutType === 'Preset') {
        dispatch(startWorkoutLog({ presetWorkoutID: workoutID }))
            .unwrap()
            .then(() => {
                navigate('/workout-logs'); // Redirect to the workout logs page after starting the workout
            })
            .catch((error) => {
                console.error('Error starting workout:', error);
                alert('Failed to start workout. Please try again.');
            });
    }
};

  // nested structure fetch for the name fixes the issue with the name not displaying for the workout
  const combinedWorkouts = [
    ...(customWorkouts || []).map((workout) => {
      const name = workout.CustomWorkout?.customWorkoutName || workout.customWorkoutName;
      return {
        ...workout,
        type: 'Custom',
        name,
      };
    }),
    ...(presetWorkouts || []).map((workout) => {
      const name = workout.PresetWorkout?.presetWorkoutName || workout.presetWorkoutName;
      return {
        ...workout,
        type: 'Preset',
        name,
      };
    }),
  ];

  let content;

  if (status === 'loading') {
    content = <p>Loading...</p>;
  } else if (status === 'succeeded') {
    content = (
      <ul className="list-group">
        {templates.map((template) => (
          <li key={template.customTemplateID} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-start">
                <img
                  src="/images/template.jpg"
                  alt="Template Image"
                  className="img-thumbnail me-3"
                  style={{ width: '100px', height: '100px' }}
                />
                <div>
                  <p><strong>Name:</strong> {template.customTemplateName}</p>
                  <p><strong>Days:</strong> {template.customTemplateDays}</p>
                </div>
              </div>
              <div>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handleShowWorkouts(template.customTemplateID)}
                >
                  {showWorkouts && selectedTemplateID === template.customTemplateID
                    ? 'Hide Workouts'
                    : 'View Workouts'}
                </button>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditTemplate(template)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleOpenDeleteModal(template.customTemplateID)}
                >
                  Delete
                </button>
              </div>
            </div>
            {showWorkouts && selectedTemplateID === template.customTemplateID && (
                <ul className="list-group mt-3">
                  {combinedWorkouts.map((workout) => (
                    <li key={workout.customWorkoutID || workout.presetWorkoutID} className="list-group-item">
                      {workout.name} - ({workout.type} Workout)
                      <button
                        className="btn btn-danger btn-sm float-end"
                        onClick={() =>
                          handleOpenRemoveModal(
                            template.customTemplateID,
                            workout.customWorkoutID || workout.presetWorkoutID,
                            workout.type
                          )
                        }
                      >
                        Remove
                      </button>
                      <button
                        className="btn btn-success btn-sm float-end me-2"
                        onClick={() => handleStartWorkout(workout.customWorkoutID || workout.presetWorkoutID, workout.type)}
                      >
                        Start Workout
                      </button>
                    </li>
                  ))}
                </ul>
              )}
          </li>
        ))}
      </ul>
    );
  } else if (status === 'failed') {
    content = <p>{error}</p>;
  }

  return (
    <section className="container mt-4">
      <h2>Custom Templates</h2>
      <button className="btn btn-primary mb-3" onClick={handleAddTemplate}>Add Custom Template</button>
      {content}
      {showAddForm && <AddCustomTemplateForm onClose={() => setShowAddForm(false)} />}
      {editingTemplate && (
        <EditCustomTemplateForm template={editingTemplate} onClose={() => setEditingTemplate(null)} />
      )}

      {/* Remove Workout Confirmation Modal */}
      <Modal show={showRemoveModal} onHide={() => setShowRemoveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Remove Workout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove this workout from the template?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRemoveModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRemoveWorkout}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Template Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this template?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteTemplate}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

    </section>
  );
};

export default CustomTemplate;