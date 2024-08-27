import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchUserPresetTemplates,
  unlinkPresetTemplate,
  fetchPresetWorkoutsForTemplate as fetchPresetWorkoutsFromPresetSlice,
} from '../features/presetTemplates/presetTemplateSlice';
import {
  fetchUserCustomTemplates,
  deleteCustomTemplate,
  fetchCustomWorkoutsForTemplate,
  fetchPresetWorkoutsForTemplate as fetchPresetWorkoutsFromCustomSlice,
  unlinkCustomWorkoutFromTemplate,
  unlinkPresetWorkoutFromTemplate,
} from '../features/customTemplates/customTemplateSlice';
import { startWorkoutLog } from '../features/workoutLogs/workoutLogSlice';
import { fetchAccountDetails } from '../features/auth/authSlice';

const UserTemplates = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const userID = user ? user.userID : null;

  const presetTemplates = useSelector((state) => state.presetTemplates.templates);
  const presetWorkouts = useSelector((state) => state.presetTemplates.presetWorkouts);
  const customTemplates = useSelector((state) => state.customTemplates.templates);
  const customWorkouts = useSelector((state) => state.customTemplates.customWorkouts);
  const presetTemplatesStatus = useSelector((state) => state.presetTemplates.status);
  const customTemplatesStatus = useSelector((state) => state.customTemplates.status);
  const presetTemplatesError = useSelector((state) => state.presetTemplates.error);
  const customTemplatesError = useSelector((state) => state.customTemplates.error);

  const [selectedTemplateID, setSelectedTemplateID] = useState(null);
  const [viewType, setViewType] = useState(null); // To distinguish between custom and preset templates

  useEffect(() => {
    if (!user) {
      dispatch(fetchAccountDetails());
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (userID) {
      dispatch(fetchUserPresetTemplates(userID));
      dispatch(fetchUserCustomTemplates());
    }
  }, [dispatch, userID]);

  const handleStartWorkout = (workoutID) => {
    dispatch(startWorkoutLog({ workoutID }));
  };

  const handleUnlinkPresetTemplate = (presetTemplateID) => {
    if (userID) {
      dispatch(unlinkPresetTemplate({ userID, presetTemplateID }));
    }
  };

  const handleDeleteCustomTemplate = (customTemplateID) => {
    dispatch(deleteCustomTemplate(customTemplateID));
  };

  const handleViewWorkouts = (templateID, type) => {
    setSelectedTemplateID(templateID);
    setViewType(type);
    if (type === 'preset') {
      dispatch(fetchPresetWorkoutsFromPresetSlice(templateID));
    } else if (type === 'custom') {
      dispatch(fetchCustomWorkoutsForTemplate(templateID));
      dispatch(fetchPresetWorkoutsFromCustomSlice(templateID)); // Fetch preset workouts for custom template
    }
  };

  const renderPresetWorkouts = () => (
    <ul>
      {presetWorkouts.map((workout) => (
        <li key={workout.presetWorkoutID}>
          {workout.presetWorkoutName} - (Preset Workout)
          <button onClick={() => handleStartWorkout(workout.presetWorkoutID)}>Start Workout</button>
        </li>
      ))}
    </ul>
  );

  const renderCustomWorkouts = () => {
    const combinedWorkouts = [
      ...(customWorkouts || []).map((workout) => ({ ...workout, type: 'Custom' })),
      ...(presetWorkouts || []).map((workout) => ({ ...workout, type: 'Preset' })),
    ];

    return (
      <ul>
        {combinedWorkouts.map((workout) => (
          <li key={workout.customWorkoutID || workout.presetWorkoutID}>
            {workout.customWorkoutName || workout.presetWorkoutName} - ({workout.type} Workout)
            <button
              onClick={() =>
                handleRemoveWorkout(
                  selectedTemplateID,
                  workout.customWorkoutID || workout.presetWorkoutID,
                  workout.type
                )
              }
            >
              Remove
            </button>
            <button onClick={() => handleStartWorkout(workout.customWorkoutID || workout.presetWorkoutID)}>
              Start Workout
            </button>
          </li>
        ))}
      </ul>
    );
  };

  const handleRemoveWorkout = (templateID, workoutID, workoutType) => {
    if (workoutType === 'Custom') {
      dispatch(unlinkCustomWorkoutFromTemplate({ id: templateID, customWorkoutID: workoutID }));
    } else if (workoutType === 'Preset') {
      dispatch(unlinkPresetWorkoutFromTemplate({ id: templateID, presetWorkoutID: workoutID }));
    }
  };

  let content;

  if (presetTemplatesStatus === 'loading' || customTemplatesStatus === 'loading') {
      content = <p>Loading...</p>;
  } else if (presetTemplatesStatus === 'succeeded' || customTemplatesStatus === 'succeeded') {
      content = (
        <>
          <h3>Your Preset Templates</h3>
          {presetTemplates.length > 0 ? (
            <ul>
              {presetTemplates.map((template) => (
                <li key={template.presetTemplateID}>
                  <div>
                    {template.presetTemplateName} - {template.presetWorkoutDifficulty} - {template.presetTemplateDays} days
                    <button onClick={() => handleViewWorkouts(template.presetTemplateID, 'preset')}>
                      {selectedTemplateID === template.presetTemplateID && viewType === 'preset' ? 'Hide Workouts' : 'View Workouts'}
                    </button>
                    <button onClick={() => handleUnlinkPresetTemplate(template.presetTemplateID)}>
                      Remove from My Templates
                    </button>
                  </div>
                  {selectedTemplateID === template.presetTemplateID && viewType === 'preset' && renderPresetWorkouts()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No preset templates found.</p>
          )}
  
          <h3>Your Custom Templates</h3>
          {customTemplates.length > 0 ? (
            <ul>
              {customTemplates.map((template) => (
                <li key={template.customTemplateID}>
                  <div>
                    {template.customTemplateName} - {template.customTemplateDays} days
                    <button onClick={() => handleViewWorkouts(template.customTemplateID, 'custom')}>
                      {selectedTemplateID === template.customTemplateID && viewType === 'custom' ? 'Hide Workouts' : 'View Workouts'}
                    </button>
                    <button onClick={() => handleDeleteCustomTemplate(template.customTemplateID)}>
                      Delete Template
                    </button>
                  </div>
                  {selectedTemplateID === template.customTemplateID && viewType === 'custom' && renderCustomWorkouts()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No custom templates found.</p>
          )}
        </>
      );
  } else if (presetTemplatesStatus === 'failed' || customTemplatesStatus === 'failed') {
      const errorMessage =
        typeof presetTemplatesError === 'string'
          ? presetTemplatesError
          : presetTemplatesError?.message || customTemplatesError?.message || 'Failed to load templates';
  
      content = <p>{errorMessage}</p>;
  }
  
  return (
    <section>
      <h2>Your Templates</h2>
      {content}
    </section>
  );
};

export default UserTemplates;