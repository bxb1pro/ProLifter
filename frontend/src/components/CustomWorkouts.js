import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchUserCustomWorkouts,
  fetchExercisesForCustomWorkout,
  unlinkExerciseFromCustomWorkout,
  deleteCustomWorkout,
} from '../features/customWorkouts/customWorkoutSlice';
import {
  fetchUserCustomTemplates,
  linkCustomWorkoutToTemplate,
} from '../features/customTemplates/customTemplateSlice';
import AddCustomWorkoutForm from './forms/AddCustomWorkoutForm';
import EditCustomWorkoutForm from './forms/EditCustomWorkoutForm';
import { startWorkoutLog } from '../features/workoutLogs/workoutLogSlice';

const CustomWorkouts = () => {
  const dispatch = useDispatch();
  const workouts = useSelector((state) => state.customWorkouts.workouts);
  const exercises = useSelector((state) => state.customWorkouts.exercises);
  const templates = useSelector((state) => state.customTemplates.templates);
  const status = useSelector((state) => state.customWorkouts.status);
  const error = useSelector((state) => state.customWorkouts.error);

  const [selectedWorkoutID, setSelectedWorkoutID] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [selectedTemplateID, setSelectedTemplateID] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUserCustomWorkouts());
      dispatch(fetchUserCustomTemplates()); // Fetch all custom templates
    }
  }, [status, dispatch]);

  const handleViewExercises = (customWorkoutID) => {
    setSelectedWorkoutID(customWorkoutID);
    dispatch(fetchExercisesForCustomWorkout(customWorkoutID));
  };

  const handleUnlinkExercise = (customWorkoutID, exerciseID) => {
    dispatch(unlinkExerciseFromCustomWorkout({ customWorkoutID, exerciseID }));
  };

  const handleDeleteWorkout = (customWorkoutID) => {
    dispatch(deleteCustomWorkout(customWorkoutID));
  };

  const handleAddWorkout = () => {
    setShowAddForm(true);
  };

  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
  };

  const handleLinkWorkoutToTemplate = (customWorkoutID, templateID) => {
    if (templateID) {
      dispatch(linkCustomWorkoutToTemplate({ id: templateID, customWorkoutID }));
      setSelectedTemplateID(''); // Reset after linking
    }
  };

  const handleStartWorkout = (workoutID) => {
    dispatch(startWorkoutLog({ customWorkoutID: workoutID }));
  };

  let content;

  if (status === 'loading') {
    content = <p>Loading...</p>;
  } else if (status === 'succeeded') {
    content = (
      <ul>
        {workouts.map((workout) => (
          <li key={workout.customWorkoutID}>
            <div>
              {workout.customWorkoutName}
              <button onClick={() => handleViewExercises(workout.customWorkoutID)}>View Exercises</button>
              <button onClick={() => handleEditWorkout(workout)}>Edit</button>
              <button onClick={() => handleDeleteWorkout(workout.customWorkoutID)}>Delete</button>
              <button onClick={() => handleStartWorkout(workout.customWorkoutID)}>Start Workout</button> {/* Start Workout Button */}
  
              {/* Dropdown to select a template to link the workout */}
              <select
                value={selectedTemplateID}
                onChange={(e) => {
                  setSelectedTemplateID(e.target.value);
                  handleLinkWorkoutToTemplate(workout.customWorkoutID, e.target.value);
                }}
              >
                <option value="">Add to Custom Template</option>
                {templates.map((template) => (
                  <option key={template.customTemplateID} value={template.customTemplateID}>
                    {template.customTemplateName}
                  </option>
                ))}
              </select>
            </div>
            {selectedWorkoutID === workout.customWorkoutID && exercises[workout.customWorkoutID] && (
              <ul>
                {exercises[workout.customWorkoutID].length > 0 ? (
                  exercises[workout.customWorkoutID].map((exercise) => (
                    <li key={exercise.exerciseID}>
                      {exercise.Exercise.exerciseName} - {exercise.Exercise.exerciseBodypart}
                      <button onClick={() => handleUnlinkExercise(workout.customWorkoutID, exercise.exerciseID)}>
                        Remove
                      </button>
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
    );
  } else if (status === 'failed') {
    content = <p>{error || 'An error occurred'}</p>;
  }

  return (
    <section>
      <h2>Your Custom Workouts</h2>
      <button onClick={handleAddWorkout}>Add Custom Workout</button>
      {content}
      {showAddForm && <AddCustomWorkoutForm onClose={() => setShowAddForm(false)} />}
      {editingWorkout && (
        <EditCustomWorkoutForm workout={editingWorkout} onClose={() => setEditingWorkout(null)} />
      )}
    </section>
  );
};

export default CustomWorkouts;