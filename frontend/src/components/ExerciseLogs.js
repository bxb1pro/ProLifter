import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchExerciseLogsByWorkout } from '../features/exerciseLogs/exerciseLogSlice';
import { useParams, Link } from 'react-router-dom';

const ExerciseLogs = () => {
  const dispatch = useDispatch();
  const { workoutLogID } = useParams(); // Get workoutLogID from the URL
  const logs = useSelector((state) => state.exerciseLogs.logs);
  const status = useSelector((state) => state.exerciseLogs.status);
  const error = useSelector((state) => state.exerciseLogs.error);

  useEffect(() => {
    if (status === 'idle' && workoutLogID) {
      dispatch(fetchExerciseLogsByWorkout(workoutLogID));
    }
  }, [status, dispatch, workoutLogID]);

  let content;

  if (status === 'loading') {
    content = <p>Loading...</p>;
  } else if (status === 'succeeded') {
    content = (
      <ul>
        {logs.map((log) => (
          <li key={log.exerciseLogID}>
            {log.exerciseID} - {log.exerciseLogDate} - {log.exerciseLogCompleted ? 'Completed' : 'In Progress'} - Sets: {log.exerciseLogSets}
            <Link to={`/exercise-logs/${log.exerciseLogID}/set-logs`}>View Sets</Link> {/* Link to set logs */}
          </li>
        ))}
      </ul>
    );
  } else if (status === 'failed') {
    content = <p>{error || 'An error occurred'}</p>;
  }

  return (
    <section>
      <h2>Exercise Logs</h2>
      {content}
    </section>
  );
};

export default ExerciseLogs;