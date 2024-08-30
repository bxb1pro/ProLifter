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

  useEffect(() => {
    console.log('Custom Workouts:', customWorkouts);
    console.log('Preset Workouts:', presetWorkouts);
  }, [customWorkouts, presetWorkouts]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const handleAddTemplate = () => {
    setShowAddForm(true);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
  };

  const handleDeleteTemplate = (customTemplateID) => {
    const confirmed = window.confirm('Are you sure you want to delete this template? This action cannot be undone.');
    if (confirmed) {
        dispatch(deleteCustomTemplate(customTemplateID))
            .unwrap()
            .then(() => {
                alert('Template deleted successfully.');
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

  const handleRemoveWorkout = (templateID, workoutID, workoutType) => {
    const confirmed = window.confirm('Are you sure you want to remove this workout from the template? This action cannot be undone.');
    
    if (confirmed) {
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
    }
};

const handleStartWorkout = (workoutID, workoutType) => {
  const confirmed = window.confirm('Start this workout?');

  if (confirmed) {
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
  }
};

  // nested structure fetch for the name fixes the issue with the name not displaying for the workout
  const combinedWorkouts = [
    ...(customWorkouts || []).map((workout) => {
      const name = workout.CustomWorkout?.customWorkoutName || workout.customWorkoutName;
      console.log('Mapping Custom Workout:', { ...workout, name });
      return {
        ...workout,
        type: 'Custom',
        name,
      };
    }),
    ...(presetWorkouts || []).map((workout) => {
      const name = workout.PresetWorkout?.presetWorkoutName || workout.presetWorkoutName;
      console.log('Mapping Preset Workout:', { ...workout, name });
      return {
        ...workout,
        type: 'Preset',
        name,
      };
    }),
  ];

  useEffect(() => {
    console.log('Combined Workouts:', combinedWorkouts);
  }, [combinedWorkouts]);

  let content;

  if (status === 'loading') {
    content = <p>Loading...</p>;
  } else if (status === 'succeeded') {
    content = (
      <ul>
        {templates.map((template) => (
          <li key={template.customTemplateID}>
            <div>
              {template.customTemplateName} - {template.customTemplateDays} days
              <button onClick={() => handleEditTemplate(template)}>Edit</button>
              <button onClick={() => handleDeleteTemplate(template.customTemplateID)}>Delete</button>
              <button onClick={() => handleShowWorkouts(template.customTemplateID)}>
                {showWorkouts && selectedTemplateID === template.customTemplateID
                  ? 'Hide Workouts'
                  : 'Show Workouts'}
              </button>
            </div>
            {showWorkouts && selectedTemplateID === template.customTemplateID && (
              <ul>
                {combinedWorkouts.map((workout) => (
                  <li key={workout.customWorkoutID || workout.presetWorkoutID}>
                    {workout.name} - ({workout.type} Workout)  {/* Use workout.name */}
                    <button
                      onClick={() =>
                        handleRemoveWorkout(
                          template.customTemplateID,
                          workout.customWorkoutID || workout.presetWorkoutID,
                          workout.type
                        )
                      }
                    >
                      Remove
                    </button>
                    <button
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
    <section>
      <h2>Custom Templates</h2>
      <button onClick={handleAddTemplate}>Add Custom Template</button>
      {content}
      {showAddForm && <AddCustomTemplateForm onClose={() => setShowAddForm(false)} />}
      {editingTemplate && (
        <EditCustomTemplateForm template={editingTemplate} onClose={() => setEditingTemplate(null)} />
      )}
    </section>
  );
};

export default CustomTemplate;