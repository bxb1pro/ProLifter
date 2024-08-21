import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserCustomWorkouts } from '../features/customWorkouts/customWorkoutSlice';

const CustomWorkouts = () => {
  const dispatch = useDispatch();
  const workouts = useSelector((state) => state.customWorkouts.workouts);
  const status = useSelector((state) => state.customWorkouts.status);
  const error = useSelector((state) => state.customWorkouts.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUserCustomWorkouts());
    }
  }, [status, dispatch]);

  let content;

  if (status === 'loading') {
    content = <p>Loading...</p>;
  } else if (status === 'succeeded') {
    content = (
      <ul>
        {workouts.map((workout) => (
          <li key={workout.customWorkoutID}>
            {workout.customWorkoutName} - {workout.customWorkoutDays} days
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
      {content}
    </section>
  );
};

export default CustomWorkouts;