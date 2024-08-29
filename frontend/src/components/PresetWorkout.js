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

const PresetWorkout = () => {
  const dispatch = useDispatch();
  const workouts = useSelector((state) => state.presetWorkouts.workouts);
  const exercises = useSelector((state) => state.presetWorkouts.exercises);
  const templates = useSelector((state) => state.presetTemplates.templates);
  const customTemplates = useSelector((state) => state.customTemplates.templates);
  const userPresetWorkouts = useSelector((state) => state.presetWorkouts.userWorkouts); // User's selected preset workouts
  const status = useSelector((state) => state.presetWorkouts.status);
  const userPresetStatus = useSelector((state) => state.presetWorkouts.status);
  const error = useSelector((state) => state.presetWorkouts.error);
  const role = useSelector((state) => state.auth.role);
  const user = useSelector((state) => state.auth.user);
  const userID = user ? user.userID : null;

  const [presetExercises, setPresetExercises] = useState({});
  const [mainSelectedWorkoutID, setMainSelectedWorkoutID] = useState(null);
  const [selectedWorkoutID, setSelectedWorkoutID] = useState(null);
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

  useEffect(() => {
    if (!user) {
      dispatch(fetchAccountDetails()).finally(() => setInitialLoadComplete(true)); // Mark initial load complete after fetching user data
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
          dispatch(fetchUserPresetWorkouts(userID)); // Fetch user's selected preset workouts
        }
      }
    }
  }, [status, dispatch, user, userID, role]);

  const handleViewMainExercises = (presetWorkoutID) => {
    setMainSelectedWorkoutID(presetWorkoutID);
    dispatch(fetchExercisesForPresetWorkout(presetWorkoutID));
  };

  const handleViewSelectedExercises = (presetWorkoutID) => {
    setSelectedPresetWorkoutID(presetWorkoutID);
    dispatch(fetchExercisesForPresetWorkout(presetWorkoutID));
  };

  const handleLinkWorkoutToUser = (presetWorkoutID) => {
    if (!userID) {
      console.error('User ID is not defined. Cannot link preset workout to user.');
      return;
    }
    dispatch(linkPresetWorkoutToUser({ userID, presetWorkoutID })).then(() => {
      dispatch(fetchUserPresetWorkouts(userID)); // Refresh the user's selected preset workouts
    });
  };

  const handleStartWorkout = (workoutID) => {
    dispatch(startWorkoutLog({ presetWorkoutID: workoutID }));
  };

  const handleUnlinkPresetWorkout = (presetWorkoutID) => {
    if (userID) {
      dispatch(unlinkPresetWorkoutFromUser({ userID, presetWorkoutID })).then(() => {
        dispatch(fetchUserPresetWorkouts(userID)); // Refresh the user's selected preset workouts
      });
    }
  };

  const handleUnlinkExercise = (presetWorkoutID, exerciseID) => {
    dispatch(unlinkExerciseFromPresetWorkout({ presetWorkoutID, exerciseID }));
  };

  const handleAddWorkout = () => {
    setShowAddForm(true);
  };

  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
  };

  const handleDeleteWorkout = (presetWorkoutID) => {
    dispatch(deletePresetWorkout(presetWorkoutID));
  };

  const handleLinkWorkoutToTemplate = (presetWorkoutID, presetTemplateID) => {
    if (presetTemplateID) {
      dispatch(linkWorkoutToPresetTemplate({ presetTemplateID, presetWorkoutID }));
      setSelectedPresetTemplateID(''); // Reset after linking
    }
  };

  const handleLinkWorkoutToCustomTemplate = (presetWorkoutID, customTemplateID) => {
    if (customTemplateID) {
      dispatch(linkWorkoutToCustomTemplate({ id: customTemplateID, presetWorkoutID }));
      setSelectedCustomTemplateID(''); // Reset after linking
    }
  };

  // Filtered workouts based on the selected filters
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
        <div>
          <label>Filter by Difficulty: </label>
          <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <label>Filter by Goal: </label>
          <select value={goalFilter} onChange={(e) => setGoalFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Size">Muscle Size</option>
            <option value="Strength">Muscle Strength</option>
            <option value="Overall">Strength & Size</option>
          </select>

          <label>Filter by Location: </label>
          <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Home">Home</option>
            <option value="Gym">Gym</option>
          </select>
        </div>

        <ul>
          {filteredWorkouts.map((workout) => (
            <li key={workout.presetWorkoutID}>
              <div>
                {workout.presetWorkoutName} - {workout.presetWorkoutDifficulty} -{' '}
                {workout.presetWorkoutGoal} - {workout.presetWorkoutLocation}
                <button onClick={() => handleViewMainExercises(workout.presetWorkoutID)}>
                  View Exercises
                </button>

                {/* Conditionally render edit and delete options for admins or superadmins */}
                {(role === 'admin' || role === 'superadmin') && (
                  <>
                    <button onClick={() => handleEditWorkout(workout)}>Edit</button>
                    <button onClick={() => handleDeleteWorkout(workout.presetWorkoutID)}>
                      Delete
                    </button>
                  </>
                )}

                {/* Only allow users to link workouts to their account */}
                {role === 'user' && (
                  <button onClick={() => handleLinkWorkoutToUser(workout.presetWorkoutID)}>
                    Add to My Workouts
                  </button>
                )}

                {/* Dropdown to select a preset template to link the workout */}
                {(role === 'admin' || role === 'superadmin') && (
                  <select
                    value={selectedPresetTemplateID}
                    onChange={(e) => {
                      setSelectedPresetTemplateID(e.target.value);
                      handleLinkWorkoutToTemplate(workout.presetWorkoutID, e.target.value);
                    }}
                  >
                    <option value="">Select Preset Template</option>
                    {templates.map((template) => (
                      <option key={template.presetTemplateID} value={template.presetTemplateID}>
                        {template.presetTemplateName}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {mainSelectedWorkoutID === workout.presetWorkoutID && exercises[workout.presetWorkoutID] && (
                <ul>
                  {exercises[workout.presetWorkoutID].length > 0 ? (
                    exercises[workout.presetWorkoutID].map((exercise) => (
                      <li key={exercise.exerciseID}>
                        {exercise.Exercise.exerciseName} - {exercise.Exercise.exerciseBodypart}
                        {(role === 'admin' || role === 'superadmin') && (
                          <button onClick={() => handleUnlinkExercise(workout.presetWorkoutID, exercise.exerciseID)}>
                            Remove
                          </button>
                        )}
                      </li>
                    ))
                  ) : (
                    <li>No Exercises Added</li>
                  )}
                </ul>
              )}
            </li>
          ))}
        </ul>

      {/* My Selected Preset Workouts - Only for user role */}
      {role === 'user' && (
        <>
          <h3>My Selected Preset Workouts</h3>
          {userPresetStatus === 'loading' ? (
            <p>Loading your selected workouts...</p>
          ) : userPresetWorkouts.length > 0 ? (
            <ul>
              {userPresetWorkouts.map((workout) => (
                <li key={workout.presetWorkoutID}>
                  <div>
                    {workout.presetWorkoutName}
                    <button onClick={() => handleViewSelectedExercises(workout.presetWorkoutID)}>
                      View Exercises
                    </button>
                    <button onClick={() => handleStartWorkout(workout.presetWorkoutID)}>
                      Start Workout
                    </button>
                    <button onClick={() => handleUnlinkPresetWorkout(workout.presetWorkoutID)}>
                      Delete
                    </button>

                    {/* Dropdown to select a custom template to link the workout */}
                    <select
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
                  {selectedPresetWorkoutID === workout.presetWorkoutID && exercises[workout.presetWorkoutID] && (
                    <ul>
                      {exercises[workout.presetWorkoutID].length > 0 ? (
                        exercises[workout.presetWorkoutID].map((exercise) => (
                          <li key={exercise.exerciseID}>
                            {exercise.Exercise.exerciseName} - {exercise.Exercise.exerciseBodypart}
                          </li>
                        ))
                      ) : (
                        <li>No Exercises Added</li>
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
    <section>
      <h2>Preset Workouts</h2>

      {/* Check if user and role are fully loaded before rendering the content */}
      {user && role && (
        <>
          {(role === 'admin' || role === 'superadmin') && (
            <button onClick={handleAddWorkout}>Add Preset Workout</button>
          )}
          {content}
          {showAddForm && <AddPresetWorkoutForm onClose={() => setShowAddForm(false)} />}
          {editingWorkout && (
            <EditPresetWorkoutForm workout={editingWorkout} onClose={() => setEditingWorkout(null)} />
          )}
        </>
      )}

      {/* Optionally, you can add a fallback message or loader if user or role is not yet available */}
      {!user && <p>Loading user data...</p>}
    </section>
  );
};

export default PresetWorkout;