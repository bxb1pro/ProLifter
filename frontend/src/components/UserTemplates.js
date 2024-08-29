import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchUserPresetTemplates,
  unlinkPresetTemplate,
  fetchPresetWorkoutsForTemplate as fetchPresetWorkoutsFromPresetSlice,
} from '../features/presetTemplates/presetTemplateSlice';
import { startWorkoutLog } from '../features/workoutLogs/workoutLogSlice';
import { fetchAccountDetails } from '../features/auth/authSlice';

const UserTemplates = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const userID = user ? user.userID : null;

  const presetTemplates = useSelector((state) => state.presetTemplates.templates);
  const presetWorkouts = useSelector((state) => state.presetTemplates.presetWorkouts);
  const presetTemplatesStatus = useSelector((state) => state.presetTemplates.status);
  const presetTemplatesError = useSelector((state) => state.presetTemplates.error);

  const [selectedTemplateID, setSelectedTemplateID] = useState(null);

  useEffect(() => {
    if (!user) {
      dispatch(fetchAccountDetails());
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (userID) {
      dispatch(fetchUserPresetTemplates(userID));
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

  const handleViewWorkouts = (templateID) => {
    setSelectedTemplateID(templateID);
    dispatch(fetchPresetWorkoutsFromPresetSlice(templateID));
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

  let content;

  if (presetTemplatesStatus === 'loading') {
    content = <p>Loading...</p>;
  } else if (presetTemplatesStatus === 'succeeded') {
    content = (
      <>
        <h3>Your Preset Templates</h3>
        {presetTemplates.length > 0 ? (
          <ul>
            {presetTemplates.map((template) => (
              <li key={template.presetTemplateID}>
                <div>
                  {template.presetTemplateName} - {template.presetWorkoutDifficulty} - {template.presetTemplateDays} days
                  <button onClick={() => handleViewWorkouts(template.presetTemplateID)}>
                    {selectedTemplateID === template.presetTemplateID ? 'Hide Workouts' : 'View Workouts'}
                  </button>
                  <button onClick={() => handleUnlinkPresetTemplate(template.presetTemplateID)}>
                    Remove from My Templates
                  </button>
                </div>
                {selectedTemplateID === template.presetTemplateID && renderPresetWorkouts()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No preset templates found.</p>
        )}
      </>
    );
  } else if (presetTemplatesStatus === 'failed') {
    const errorMessage =
      typeof presetTemplatesError === 'string'
        ? presetTemplatesError
        : presetTemplatesError?.message || 'Failed to load templates';

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