import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchUserCustomWorkouts,
  fetchExercisesForCustomWorkout,
  unlinkExerciseFromCustomWorkout,
  deleteCustomWorkout,
} from '../features/customWorkouts/customWorkoutSlice';
import AddCustomWorkoutForm from './forms/AddCustomWorkoutForm';
import EditCustomWorkoutForm from './forms/EditCustomWorkoutForm';

const CustomWorkouts = () => {
  const dispatch = useDispatch();
  const workouts = useSelector((state) => state.customWorkouts.workouts);
  const exercises = useSelector((state) => state.customWorkouts.exercises);
  const status = useSelector((state) => state.customWorkouts.status);
  const error = useSelector((state) => state.customWorkouts.error);
  const [selectedWorkoutID, setSelectedWorkoutID] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUserCustomWorkouts());
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
            </div>
            {selectedWorkoutID === workout.customWorkoutID && exercises[workout.customWorkoutID] && (
              <ul>
                {exercises[workout.customWorkoutID].map((exercise) => (
                  <li key={exercise.exerciseID}>
                    {exercise.Exercise.exerciseName} - {exercise.Exercise.exerciseBodypart}
                    <button onClick={() => handleUnlinkExercise(workout.customWorkoutID, exercise.exerciseID)}>
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