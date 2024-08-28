import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPresetTemplates,
  deletePresetTemplate,
  linkPresetTemplate,
  fetchPresetWorkoutsForTemplate,
  unlinkPresetWorkoutFromTemplate,
} from '../features/presetTemplates/presetTemplateSlice';
import AddPresetTemplateForm from './forms/AddPresetTemplateForm';
import EditPresetTemplateForm from './forms/EditPresetTemplateForm';
import { fetchAccountDetails } from '../features/auth/authSlice';

const PresetTemplate = () => {
  const dispatch = useDispatch();
  const templates = useSelector((state) => state.presetTemplates.templates);
  const presetWorkouts = useSelector((state) => state.presetTemplates.presetWorkouts);
  const status = useSelector((state) => state.presetTemplates.status);
  const error = useSelector((state) => state.presetTemplates.error);
  const role = useSelector((state) => state.auth.role);
  const user = useSelector((state) => state.auth.user);
  const userID = user ? user.userID : null;

  useEffect(() => {
    if (!user) {
      dispatch(fetchAccountDetails()); // Fetch user details if not already available
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPresetTemplates());
    }
  }, [status, dispatch]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [viewingWorkouts, setViewingWorkouts] = useState(null);

  // Filters
  const [daysFilter, setDaysFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [goalFilter, setGoalFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const handleLinkTemplateToUser = (presetTemplateID) => {
    if (!userID) {
      console.error('User ID is not defined. Cannot link preset template to user.');
      return;
    }
    dispatch(linkPresetTemplate({ userID, presetTemplateID }));
  };

  const handleAddTemplate = () => {
    setShowAddForm(true);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
  };

  const handleDeleteTemplate = (presetTemplateID) => {
    dispatch(deletePresetTemplate(presetTemplateID));
  };

  const handleViewWorkouts = (presetTemplateID) => {
    dispatch(fetchPresetWorkoutsForTemplate(presetTemplateID));
    setViewingWorkouts(presetTemplateID);
  };

  const handleUnlinkWorkout = (presetTemplateID, presetWorkoutID) => {
    dispatch(unlinkPresetWorkoutFromTemplate({ presetTemplateID, presetWorkoutID }));
  };

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
                {template.presetTemplateName} - {template.presetTemplateDifficulty} - {template.presetTemplateDays} days 
                <button onClick={() => handleViewWorkouts(template.presetTemplateID)}>View Workouts</button>
                {(role === 'admin' || role === 'superadmin') && (
                  <>
                    <button onClick={() => handleEditTemplate(template)}>Edit</button>
                    <button onClick={() => handleDeleteTemplate(template.presetTemplateID)}>Delete</button>
                  </>
                )}
               
               {role === 'user' && (
                  <button onClick={() => handleLinkTemplateToUser(template.presetTemplateID)}>Add to My Templates</button>
                )}

                {viewingWorkouts === template.presetTemplateID && presetWorkouts.length > 0 && (
                  <ul>
                    {presetWorkouts.map((workout) => (
                      <li key={workout.presetWorkoutID}>
                        {workout.PresetWorkout.presetWorkoutName}
                        {(role === 'admin' || role === 'superadmin') && (
                        <button onClick={() => handleUnlinkWorkout(template.presetTemplateID, workout.presetWorkoutID)}>
                          Remove
                        </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </>
    );
  } else if (status === 'failed') {
    content = <p>{error}</p>;
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
        <EditPresetTemplateForm template={editingTemplate} onClose={() => setEditingTemplate(null)} />
      )}
    </section>
  );
};

export default PresetTemplate;