import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserWorkoutLogs } from '../features/workoutLogs/workoutLogSlice';
import { Link } from 'react-router-dom';

const WorkoutLogs = () => {
    const dispatch = useDispatch();
    const logs = useSelector((state) => state.workoutLogs.logs);
    const status = useSelector((state) => state.workoutLogs.status);
    const error = useSelector((state) => state.workoutLogs.error);
  
    useEffect(() => {
      if (status === 'idle') {
        dispatch(fetchUserWorkoutLogs());
      }
    }, [status, dispatch]);
  
    let content;
  
    if (status === 'loading') {
      content = <p>Loading...</p>;
    } else if (status === 'succeeded') {
      content = (
        <ul>
          {logs.map((log) => (
            <li key={log.workoutLogID}>
              {log.workoutLogDate} - {log.workoutLogCompleted ? 'Completed' : 'In Progress'}
              <Link to={`/workout-logs/${log.workoutLogID}/exercise-logs`}>View Exercises</Link> {/* Add the Link here */}
            </li>
          ))}
        </ul>
      );
    } else if (status === 'failed') {
      content = <p>{error.message || 'An error occurred'}</p>;
    }
  
    return (
      <section>
        <h2>Workout Logs</h2>
        {content}
      </section>
    );
  };
  
  export default WorkoutLogs;