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
import AddCustomTemplateForm from './forms/AddCustomTemplateForm';
import EditCustomTemplateForm from './forms/EditCustomTemplateForm';
import { fetchAccountDetails } from '../features/auth/authSlice';

const CustomTemplate = () => {
  const dispatch = useDispatch();
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

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const handleAddTemplate = () => {
    setShowAddForm(true);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
  };

  const handleDeleteTemplate = (customTemplateID) => {
    dispatch(deleteCustomTemplate(customTemplateID));
  };

  const handleShowWorkouts = (templateID) => {
    setSelectedTemplateID(templateID);
    dispatch(fetchCustomWorkoutsForTemplate(templateID));
    dispatch(fetchPresetWorkoutsForTemplate(templateID));
    setShowWorkouts(!showWorkouts); // Toggle the view
  };

  const handleRemoveWorkout = (templateID, workoutID, workoutType) => {
    if (workoutType === 'Custom') {
      dispatch(unlinkCustomWorkoutFromTemplate({ id: templateID, customWorkoutID: workoutID }));
    } else if (workoutType === 'Preset') {
      dispatch(unlinkPresetWorkoutFromTemplate({ id: templateID, presetWorkoutID: workoutID }));
    }
  };

  const combinedWorkouts = [
    ...(customWorkouts || []).map((workout) => ({ ...workout, type: 'Custom' })),
    ...(presetWorkouts || []).map((workout) => ({ ...workout, type: 'Preset' })),
  ];

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
                    {workout.customWorkoutName || workout.presetWorkoutName} - ({workout.type} Workout)
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