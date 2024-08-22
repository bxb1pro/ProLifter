import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserWorkoutLogs } from '../features/workoutLogs/workoutLogSlice';

const WorkoutLogs = () => {
  const dispatch = useDispatch();
  const workoutLogs = useSelector((state) => state.workoutLogs.logs);
  const workoutLogStatus = useSelector((state) => state.workoutLogs.status);
  const error = useSelector((state) => state.workoutLogs.error);

  useEffect(() => {
    dispatch(fetchUserWorkoutLogs());
  }, [dispatch]);

  let content;

  if (workoutLogStatus === 'loading') {
    content = <p>Loading...</p>;
  } else if (workoutLogStatus === 'succeeded') {
    content = (
      <ul>
        {workoutLogs.map((log) => (
          <li key={log.workoutLogID}>
            {log.presetWorkoutID
              ? `Preset Workout Log: ${log.presetWorkoutID}`
              : `Custom Workout Log: ${log.customWorkoutID}`}
            <p>Date: {new Date(log.workoutLogDate).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    );
  } else if (workoutLogStatus === 'failed') {
    content = <p>{error}</p>;
  }

  return (
    <section>
      <h2>My Workout Logs</h2>
      <h3>Started Workouts</h3>
      {content}
    </section>
  );
};

export default WorkoutLogs;