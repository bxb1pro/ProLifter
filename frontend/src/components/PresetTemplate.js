import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPresetTemplates,
  deletePresetTemplate,
  linkPresetTemplate,
  fetchPresetWorkoutsForTemplate,
  unlinkPresetWorkoutFromTemplate,
  fetchUserPresetTemplates,
  unlinkPresetTemplate as unlinkUserPresetTemplate,
} from '../features/presetTemplates/presetTemplateSlice';
import { startWorkoutLog } from '../features/workoutLogs/workoutLogSlice';
import AddPresetTemplateForm from './forms/AddPresetTemplateForm';
import EditPresetTemplateForm from './forms/EditPresetTemplateForm';
import { fetchAccountDetails } from '../features/auth/authSlice';

const PresetTemplate = () => {
  const dispatch = useDispatch();
  const templates = useSelector((state) => state.presetTemplates.templates || []);
  const userPresetTemplates = useSelector((state) => state.presetTemplates.userTemplates || []);
  const presetWorkouts = useSelector((state) => state.presetTemplates.presetWorkouts || []);
  const status = useSelector((state) => state.presetTemplates.status);
  const error = useSelector((state) => state.presetTemplates.error);
  const role = useSelector((state) => state.auth.role);
  const user = useSelector((state) => state.auth.user);
  const userID = user ? user.userID : null;

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [viewingWorkouts, setViewingWorkouts] = useState(null);
  const [selectedUserTemplateID, setSelectedUserTemplateID] = useState(null);

  // Filters
  const [daysFilter, setDaysFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [goalFilter, setGoalFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    if (!user) {
      dispatch(fetchAccountDetails());
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user && userID) {
      if (status === 'idle') {
        dispatch(fetchPresetTemplates());
        dispatch(fetchUserPresetTemplates(userID)); // Fetch user's selected preset templates
      }
    }
  }, [status, dispatch, user, userID]);

  const handleLinkTemplateToUser = (presetTemplateID) => {
    if (!userID) {
      console.error('User ID is not defined. Cannot link preset template to user.');
      return;
    }
    dispatch(linkPresetTemplate({ userID, presetTemplateID })).then(() => {
      dispatch(fetchUserPresetTemplates(userID)); // Refresh the user's selected preset templates
    });
  };

  const handleStartWorkout = (workoutID) => {
    dispatch(startWorkoutLog({ presetWorkoutID: workoutID }));
  };

  const handleViewWorkouts = (presetTemplateID) => {
    setViewingWorkouts(presetTemplateID);
    dispatch(fetchPresetWorkoutsForTemplate(presetTemplateID));
  };

  const handleViewUserWorkouts = (presetTemplateID) => {
    setSelectedUserTemplateID(presetTemplateID);
    dispatch(fetchPresetWorkoutsForTemplate(presetTemplateID));
  };

  const handleUnlinkWorkout = (presetTemplateID, presetWorkoutID) => {
    dispatch(unlinkPresetWorkoutFromTemplate({ presetTemplateID, presetWorkoutID })).then(() => {
      dispatch(fetchPresetWorkoutsForTemplate(presetTemplateID));
    });
  };

  const handleUnlinkUserTemplate = (presetTemplateID) => {
    dispatch(unlinkUserPresetTemplate({ userID, presetTemplateID })).then(() => {
      dispatch(fetchUserPresetTemplates(userID)); // Refresh the user's selected preset templates
    });
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
  };

  const handleDeleteTemplate = (presetTemplateID) => {
    const confirmed = window.confirm('Are you sure you want to delete this template? This action cannot be undone.');
    if (confirmed) {
      dispatch(deletePresetTemplate(presetTemplateID))
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

  const handleAddTemplate = () => {
    setShowAddForm(true);
  };

  const renderPresetWorkouts = () => (
    <ul>
      {presetWorkouts.map((workout) => (
        <li key={workout.presetWorkoutID}>
          {workout.PresetWorkout.presetWorkoutName}
          <button onClick={() => handleStartWorkout(workout.presetWorkoutID)}>Start Workout</button>
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
        <div>
          <label>Filter by Days: </label>
          <select value={daysFilter} onChange={(e) => setDaysFilter(e.target.value)}>
            <option value="">All</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
          </select>

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
          {filteredTemplates.map((template) => (
            <li key={template.presetTemplateID}>
              <div>
                {template.presetTemplateName} - {template.presetTemplateDifficulty} -{' '}
                {template.presetTemplateDays} days - {template.presetTemplateGoal} -{' '}
                {template.presetTemplateLocation}
                <button onClick={() => handleViewWorkouts(template.presetTemplateID)}>View Workouts</button>
                {(role === 'admin' || role === 'superadmin') && (
                  <>
                    <button onClick={() => handleEditTemplate(template)}>Edit</button>
                    <button onClick={() => handleDeleteTemplate(template.presetTemplateID)}>Delete</button>
                  </>
                )}
                {role === 'user' && (
                  <button onClick={() => handleLinkTemplateToUser(template.presetTemplateID)}>
                    Add to My Templates
                  </button>
                )}
                  {viewingWorkouts === template.presetTemplateID && presetWorkouts.length > 0 && (
                    <ul>
                      {presetWorkouts.map((workout) => (
                        <li key={workout.presetWorkoutID}>
                          {workout.PresetWorkout.presetWorkoutName}
                          {(role === 'admin' || role === 'superadmin') && (
                            <button
                              onClick={() =>
                                handleUnlinkWorkout(template.presetTemplateID, workout.presetWorkoutID)
                              }
                            >
                              Remove
                            </button>
                          )}
                          {/* No condition for rendering the Start Workout button, just ensure the name renders */}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            </li>
          ))}
        </ul>

        {/* My Selected Preset Templates - Only for user role */}
        {role === 'user' && (
          <>
            <h3>My Selected Preset Templates</h3>
            {userPresetTemplates.length > 0 ? (
              <ul>
                {userPresetTemplates.map((template) => (
                  <li key={template.presetTemplateID}>
                    <div>
                      {template.presetTemplateName}
                      <button onClick={() => handleViewUserWorkouts(template.presetTemplateID)}>
                        View Workouts
                      </button>
                      <button onClick={() => handleUnlinkUserTemplate(template.presetTemplateID)}>
                        Remove from My Templates
                      </button>
                    </div>
                    {selectedUserTemplateID === template.presetTemplateID &&
                      renderPresetWorkouts()}
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
    <section>
      <h2>Preset Templates</h2>
      {(role === 'admin' || role === 'superadmin') && (
        <button onClick={handleAddTemplate}>Add Preset Template</button>
      )}
      {content}
      {showAddForm && <AddPresetTemplateForm onClose={() => setShowAddForm(false)} />}
      {editingTemplate && (
        <EditPresetTemplateForm
          template={editingTemplate}
          onClose={() => setEditingTemplate(null)}
        />
      )}
    </section>
  );
};

export default PresetTemplate;