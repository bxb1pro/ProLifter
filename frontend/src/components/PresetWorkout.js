import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPresetWorkouts,
  fetchExercisesForPresetWorkout,
  unlinkExerciseFromPresetWorkout,
  deletePresetWorkout,
  linkPresetWorkoutToUser
} from '../features/presetWorkouts/presetWorkoutSlice';
import AddPresetWorkoutForm from './forms/AddPresetWorkoutForm';
import EditPresetWorkoutForm from './forms/EditPresetWorkoutForm';
import { fetchAccountDetails } from '../features/auth/authSlice'; 


const PresetWorkout = () => {
  const dispatch = useDispatch();
  const workouts = useSelector((state) => state.presetWorkouts.workouts);
  const exercises = useSelector((state) => state.presetWorkouts.exercises);
  const status = useSelector((state) => state.presetWorkouts.status);
  const error = useSelector((state) => state.presetWorkouts.error);

  const user = useSelector((state) => state.auth.user);
  const userID = user ? user.userID : null;

  useEffect(() => {
    if (!user) {
      dispatch(fetchAccountDetails()); // Fetch user details if not already available
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPresetWorkouts());
    }
  }, [status, dispatch]);

  const [selectedWorkoutID, setSelectedWorkoutID] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);

  // Filters
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [goalFilter, setGoalFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const handleViewExercises = (presetWorkoutID) => {
    setSelectedWorkoutID(presetWorkoutID);
    dispatch(fetchExercisesForPresetWorkout(presetWorkoutID));
  };

  const handleLinkWorkoutToUser = (presetWorkoutID) => {
    console.log('User ID:', userID);

    if (!userID) {
      console.error('User ID is not defined. Cannot link preset workout to user.');
      return;
    }

    dispatch(linkPresetWorkoutToUser({ userID, presetWorkoutID }));
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
                {workout.presetWorkoutName} - {workout.presetWorkoutDifficulty}
                <button onClick={() => handleViewExercises(workout.presetWorkoutID)}>View Exercises</button>
                <button onClick={() => handleEditWorkout(workout)}>Edit</button>
                <button onClick={() => handleDeleteWorkout(workout.presetWorkoutID)}>Delete</button>
                <button onClick={() => handleLinkWorkoutToUser(workout.presetWorkoutID)}>Add to My Workouts</button>
              </div>
              {selectedWorkoutID === workout.presetWorkoutID && exercises[workout.presetWorkoutID] && (
                <ul>
                  {exercises[workout.presetWorkoutID].map((exercise) => (
                    <li key={exercise.exerciseID}>
                      {exercise.Exercise.exerciseName} - {exercise.Exercise.exerciseBodypart}
                      <button onClick={() => handleUnlinkExercise(workout.presetWorkoutID, exercise.exerciseID)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
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
      <h2>Preset Workouts</h2>
      <button onClick={handleAddWorkout}>Add Preset Workout</button>
      {content}
      {showAddForm && <AddPresetWorkoutForm onClose={() => setShowAddForm(false)} />}
      {editingWorkout && (
        <EditPresetWorkoutForm workout={editingWorkout} onClose={() => setEditingWorkout(null)} />
      )}
    </section>
  );
};

export default PresetWorkout;