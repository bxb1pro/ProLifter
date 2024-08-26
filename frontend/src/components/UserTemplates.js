import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchUserPresetTemplates,
  unlinkPresetTemplate,
} from '../features/presetTemplates/presetTemplateSlice';
import {
  fetchUserCustomTemplates,
  deleteCustomTemplate,
} from '../features/customTemplates/customTemplateSlice';
import { startWorkoutLog } from '../features/workoutLogs/workoutLogSlice';
import { fetchAccountDetails } from '../features/auth/authSlice';

const UserTemplates = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const userID = user ? user.userID : null;

  const presetTemplates = useSelector((state) => state.presetTemplates.templates);
  const customTemplates = useSelector((state) => state.customTemplates.templates);
  const presetTemplatesStatus = useSelector((state) => state.presetTemplates.status);
  const customTemplatesStatus = useSelector((state) => state.customTemplates.status);
  const presetTemplatesError = useSelector((state) => state.presetTemplates.error);
  const customTemplatesError = useSelector((state) => state.customTemplates.error);

  const [selectedTemplateID, setSelectedTemplateID] = useState(null);

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

  const handleStartWorkout = (presetWorkoutID) => {
    dispatch(startWorkoutLog({ presetWorkoutID }));
  };

  const handleUnlinkPresetTemplate = (presetTemplateID) => {
    if (userID) {
      dispatch(unlinkPresetTemplate({ userID, presetTemplateID }));
    }
  };

  const handleDeleteCustomTemplate = (customTemplateID) => {
    dispatch(deleteCustomTemplate(customTemplateID));
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
                  <button onClick={() => setSelectedTemplateID(template.presetTemplateID)}>
                    View Workouts
                  </button>
                  <button onClick={() => handleUnlinkPresetTemplate(template.presetTemplateID)}>
                    Remove from My Templates
                  </button>
                  {selectedTemplateID === template.presetTemplateID && template.PresetTemplatePresetWorkouts && (
                    <ul>
                      {template.PresetTemplatePresetWorkouts.map((workout) => (
                        <li key={workout.presetWorkoutID}>
                          {workout.PresetWorkout.presetWorkoutName}
                          <button onClick={() => handleStartWorkout(workout.presetWorkoutID)}>
                            Start Workout
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
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
                  <button onClick={() => handleDeleteCustomTemplate(template.customTemplateID)}>
                    Delete Template
                  </button>
                </div>
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