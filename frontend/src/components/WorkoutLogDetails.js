import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkoutLogDetails, finishWorkoutLog } from '../features/workoutLogs/workoutLogSlice';
import { useParams } from 'react-router-dom';

const WorkoutLogDetails = () => {
  const { workoutLogID } = useParams();
  const dispatch = useDispatch();
  const workoutLog = useSelector((state) => state.workoutLogs.currentLog);
  const status = useSelector((state) => state.workoutLogs.status);
  const error = useSelector((state) => state.workoutLogs.error);

  useEffect(() => {
    if (workoutLogID) {
      dispatch(fetchWorkoutLogDetails(workoutLogID));
    }
  }, [dispatch, workoutLogID]);

  const handleFinishWorkout = () => {
    dispatch(finishWorkoutLog(workoutLogID));
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'failed') {
    return <p>{error}</p>;
  }

  if (!workoutLog) {
    return <p>No workout log found.</p>;
  }

  return (
    <section>
      <h2>Workout Log Details</h2>
      <p>Date: {new Date(workoutLog.workoutLogDate).toLocaleDateString()}</p>
      <p>Completed: {workoutLog.workoutLogCompleted ? 'Yes' : 'No'}</p>
      <h3>Exercises:</h3>
      <ul>
        {workoutLog.exercises && workoutLog.exercises.length > 0 ? (
          workoutLog.exercises.map((exercise) => (
            <li key={exercise.exerciseLogID}>
              {exercise.Exercise.exerciseName} - {exercise.exerciseLogSets} Sets
            </li>
          ))
        ) : (
          <p>No exercises found for this workout log.</p>
        )}
      </ul>
      {!workoutLog.workoutLogCompleted && (
        <button onClick={handleFinishWorkout}>Finish Workout</button>
      )}
    </section>
  );
};

export default WorkoutLogDetails;