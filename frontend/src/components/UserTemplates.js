import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchUserPresetTemplates,
} from '../features/presetTemplates/presetTemplateSlice';
import { startWorkoutLog } from '../features/workoutLogs/workoutLogSlice';
import { fetchAccountDetails } from '../features/auth/authSlice';

const UserTemplates = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const userID = user ? user.userID : null;

  const presetTemplates = useSelector((state) => state.presetTemplates.templates);
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

  const handleStartWorkout = (presetWorkoutID) => {
    dispatch(startWorkoutLog({ presetWorkoutID }));
  };

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
                  <button onClick={() => setSelectedTemplateID(template.presetTemplateID)}>
                    View Workouts
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
      </>
    );
  } else if (presetTemplatesStatus === 'failed') {
    // Check if presetTemplatesError is an object and display the message correctly
    const errorMessage =
      typeof presetTemplatesError === 'string'
        ? presetTemplatesError
        : presetTemplatesError?.message || 'Failed to load templates';

    content = <p>{errorMessage}</p>;
  }

  return (
    <section>
      <h2>Your Preset Templates</h2>
      {content}
    </section>
  );
};

export default UserTemplates;