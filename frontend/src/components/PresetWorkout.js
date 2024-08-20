import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPresetWorkouts } from '../features/presetWorkouts/presetWorkoutSlice';

const PresetWorkout = () => {
  const dispatch = useDispatch();
  const workouts = useSelector((state) => state.presetWorkouts.workouts);
  const status = useSelector((state) => state.presetWorkouts.status);
  const error = useSelector((state) => state.presetWorkouts.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPresetWorkouts());
    }
  }, [status, dispatch]);

  let content;

  if (status === 'loading') {
    content = <p>Loading...</p>;
  } else if (status === 'succeeded') {
    content = (
      <ul>
        {workouts.map((workout) => (
          <li key={workout.presetWorkoutID}>
            {workout.presetWorkoutName} - {workout.presetWorkoutDays} days - {workout.presetWorkoutDifficulty}
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
      {content}
    </section>
  );
};

export default PresetWorkout;