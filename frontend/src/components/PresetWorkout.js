import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPresetWorkouts,
  fetchExercisesForPresetWorkout,
  unlinkExerciseFromPresetWorkout,
  deletePresetWorkout,
} from '../features/presetWorkouts/presetWorkoutSlice';
import AddPresetWorkoutForm from './forms/AddPresetWorkoutForm';
import EditPresetWorkoutForm from './forms/EditPresetWorkoutForm';

const PresetWorkout = () => {
  const dispatch = useDispatch();
  const workouts = useSelector((state) => state.presetWorkouts.workouts);
  const exercises = useSelector((state) => state.presetWorkouts.exercises);
  const status = useSelector((state) => state.presetWorkouts.status);
  const error = useSelector((state) => state.presetWorkouts.error);
  const [selectedWorkoutID, setSelectedWorkoutID] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPresetWorkouts());
    }
  }, [status, dispatch]);

  const handleViewExercises = (presetWorkoutID) => {
    setSelectedWorkoutID(presetWorkoutID);
    dispatch(fetchExercisesForPresetWorkout(presetWorkoutID));
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

  let content;

  if (status === 'loading') {
    content = <p>Loading...</p>;
  } else if (status === 'succeeded') {
    content = (
      <ul>
        {workouts.map((workout) => (
          <li key={workout.presetWorkoutID}>
            <div>
              {workout.presetWorkoutName} - {workout.presetWorkoutDays} days - {workout.presetWorkoutDifficulty}
              <button onClick={() => handleViewExercises(workout.presetWorkoutID)}>View Exercises</button>
              <button onClick={() => handleEditWorkout(workout)}>Edit</button>
              <button onClick={() => handleDeleteWorkout(workout.presetWorkoutID)}>Delete</button>
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