import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkoutLogDetails, finishWorkoutLog } from '../features/workoutLogs/workoutLogSlice';
import { editExerciseLog, deleteExerciseLog } from '../features/exerciseLogs/exerciseLogSlice';
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

  const handleCompleteExercise = (exerciseLogID) => {
    dispatch(editExerciseLog({ exerciseLogID, exerciseLogCompleted: true }));
  };

  const handleDeleteExercise = (exerciseLogID) => {
    if (window.confirm('Are you sure you want to delete this exercise log?')) {
      dispatch(deleteExerciseLog(exerciseLogID));
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'failed') {
    return <p>Error: {error?.message || 'Failed to load workout log.'}</p>;
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
        {workoutLog.ExerciseLogs && workoutLog.ExerciseLogs.length > 0 ? (
          workoutLog.ExerciseLogs.map((exerciseLog) => (
            <li key={exerciseLog.exerciseLogID}>
              <strong>{exerciseLog.Exercise.exerciseName} - {exerciseLog.Exercise.exerciseBodypart}</strong>
              <p>Status: {exerciseLog.exerciseLogCompleted ? 'Completed' : 'Incomplete'}</p>
              {!exerciseLog.exerciseLogCompleted && (
                <button onClick={() => handleCompleteExercise(exerciseLog.exerciseLogID)}>
                  Mark as Completed
                </button>
              )}
              <button onClick={() => handleDeleteExercise(exerciseLog.exerciseLogID)}>
                Delete Exercise
              </button>
              <ul>
                {exerciseLog.SetLogs && exerciseLog.SetLogs.length > 0 ? (
                  exerciseLog.SetLogs.map((setLog, index) => (
                    <li key={index}>
                      Set {index + 1}: {setLog.setLogReps} reps @ {setLog.setLogRPE} RPE
                    </li>
                  ))
                ) : (
                  <li>No sets recorded for this exercise.</li>
                )}
              </ul>
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