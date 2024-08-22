import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchUserCustomWorkouts,
  fetchExercisesForCustomWorkout,
  deleteCustomWorkout,
} from '../features/customWorkouts/customWorkoutSlice';
import { fetchUserPresetWorkouts, unlinkPresetWorkoutFromUser } from '../features/presetWorkouts/presetWorkoutSlice';
import { startWorkoutLog } from '../features/workoutLogs/workoutLogSlice';
import { fetchAccountDetails } from '../features/auth/authSlice';

const UserWorkouts = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const userID = user ? user.userID : null;

  const customWorkouts = useSelector((state) => state.customWorkouts.workouts);
  const presetWorkouts = useSelector((state) => state.presetWorkouts.userWorkouts);
  const exercises = useSelector((state) => state.customWorkouts.exercises);

  const customWorkoutsStatus = useSelector((state) => state.customWorkouts.status);
  const presetWorkoutsStatus = useSelector((state) => state.presetWorkouts.status);

  const customWorkoutsError = useSelector((state) => state.customWorkouts.error);
  const presetWorkoutsError = useSelector((state) => state.presetWorkouts.error);

  const [selectedWorkoutID, setSelectedWorkoutID] = useState(null);

  useEffect(() => {
    if (!user) {
      dispatch(fetchAccountDetails());
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (userID) {
      dispatch(fetchUserCustomWorkouts());
      dispatch(fetchUserPresetWorkouts(userID));
    }
  }, [dispatch, userID]);

  const handleViewExercises = (customWorkoutID) => {
    setSelectedWorkoutID(customWorkoutID);
    dispatch(fetchExercisesForCustomWorkout(customWorkoutID));
  };

  const handleStartWorkout = (workoutID, isCustom) => {
    if (isCustom) {
      dispatch(startWorkoutLog({ customWorkoutID: workoutID }));
    } else {
      dispatch(startWorkoutLog({ presetWorkoutID: workoutID }));
    }
  };

  const handleDeleteCustomWorkout = (customWorkoutID) => {
    dispatch(deleteCustomWorkout(customWorkoutID));
  };

  const handleUnlinkPresetWorkout = (presetWorkoutID) => {
    if (userID) {
      dispatch(unlinkPresetWorkoutFromUser({ userID, presetWorkoutID }));
    }
  };

  let content;

  if (customWorkoutsStatus === 'loading' || presetWorkoutsStatus === 'loading') {
    content = <p>Loading...</p>;
  } else if (customWorkoutsStatus === 'succeeded' || presetWorkoutsStatus === 'succeeded') {
    content = (
      <>
        <h3>Custom Workouts</h3>
        {customWorkouts.length > 0 ? (
          <ul>
            {customWorkouts.map((workout) => (
              <li key={workout.customWorkoutID}>
                <div>
                  {workout.customWorkoutName}
                  <button onClick={() => handleViewExercises(workout.customWorkoutID)}>View Exercises</button>
                  <button onClick={() => handleStartWorkout(workout.customWorkoutID, true)}>Start Workout</button>
                  <button onClick={() => handleDeleteCustomWorkout(workout.customWorkoutID)}>Delete</button>
                </div>
                {selectedWorkoutID === workout.customWorkoutID && exercises[workout.customWorkoutID] && (
                  <ul>
                    {exercises[workout.customWorkoutID].map((exercise) => (
                      <li key={exercise.exerciseID}>
                        {exercise.Exercise.exerciseName} - {exercise.Exercise.exerciseBodypart}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No custom workouts found.</p>
        )}

        <h3>Preset Workouts</h3>
        {presetWorkouts.length > 0 ? (
          <ul>
            {presetWorkouts.map((workout) => (
              <li key={workout.presetWorkoutID}>
                <div>
                  {workout.presetWorkoutName}
                  <button onClick={() => handleStartWorkout(workout.presetWorkoutID, false)}>Start Workout</button>
                  <button onClick={() => handleUnlinkPresetWorkout(workout.presetWorkoutID)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No preset workouts found.</p>
        )}
      </>
    );
  } else if (customWorkoutsStatus === 'failed' || presetWorkoutsStatus === 'failed') {
    content = (
      <p>
        {customWorkoutsError && `Error loading custom workouts: ${customWorkoutsError}`}
        {presetWorkoutsError && `Error loading preset workouts: ${presetWorkoutsError}`}
      </p>
    );
  }

  return (
    <section>
      <h2>Your Workouts</h2>
      {content}
    </section>
  );
};

export default UserWorkouts;