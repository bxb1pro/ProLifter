import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserWorkoutLogs, deleteWorkoutLog } from '../features/workoutLogs/workoutLogSlice';
import { Link } from 'react-router-dom';

const WorkoutLogs = () => {
  const dispatch = useDispatch();
  const workoutLogs = useSelector((state) => state.workoutLogs.logs);
  const workoutLogStatus = useSelector((state) => state.workoutLogs.status);
  const error = useSelector((state) => state.workoutLogs.error);

  useEffect(() => {
    dispatch(fetchUserWorkoutLogs());
  }, [dispatch]);

  const handleDeleteWorkoutLog = (workoutLogID) => {
    if (window.confirm('Are you sure you want to delete this workout log?')) {
      dispatch(deleteWorkoutLog(workoutLogID));
    }
  };

  const startedLogs = workoutLogs.filter(log => !log.workoutLogCompleted);
  const finishedLogs = workoutLogs.filter(log => log.workoutLogCompleted);

  let content;

  if (workoutLogStatus === 'loading') {
    content = <p>Loading...</p>;
  } else if (workoutLogStatus === 'succeeded') {
    content = (
      <>
        <section>
          <h3>Started Workouts</h3>
          {startedLogs.length > 0 ? (
            <ul>
              {startedLogs.map((log) => (
                <li key={log.workoutLogID}>
                  <Link to={`/workout-logs/${log.workoutLogID}`}>
                    {log.presetWorkoutID
                      ? `Preset Workout Log: ${log.presetWorkoutID}`
                      : `Custom Workout Log: ${log.customWorkoutID}`}
                  </Link>
                  <p>Date: {new Date(log.workoutLogDate).toLocaleDateString()}</p>
                  <button onClick={() => handleDeleteWorkoutLog(log.workoutLogID)}>Delete Workout</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No started workouts found.</p>
          )}
        </section>

        <section>
          <h3>Finished Workouts</h3>
          {finishedLogs.length > 0 ? (
            <ul>
              {finishedLogs.map((log) => (
                <li key={log.workoutLogID}>
                  <Link to={`/workout-logs/${log.workoutLogID}`}>
                    {log.presetWorkoutID
                      ? `Preset Workout Log: ${log.presetWorkoutID}`
                      : `Custom Workout Log: ${log.customWorkoutID}`}
                  </Link>
                  <p>Date: {new Date(log.workoutLogDate).toLocaleDateString()}</p>
                  <button onClick={() => handleDeleteWorkoutLog(log.workoutLogID)}>Delete Workout</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No finished workouts found.</p>
          )}
        </section>
      </>
    );
  } else if (workoutLogStatus === 'failed') {
    content = <p>{error}</p>;
  }

  return (
    <section>
      <h2>My Workout Logs</h2>
      {content}
    </section>
  );
};

export default WorkoutLogs;