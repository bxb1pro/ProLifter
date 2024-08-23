import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkoutLogDetails, finishWorkoutLog } from '../features/workoutLogs/workoutLogSlice';
import { editExerciseLog, deleteExerciseLog } from '../features/exerciseLogs/exerciseLogSlice';
import { addSetLog, deleteSetLog } from '../features/setLogs/setLogSlice';
import { useParams } from 'react-router-dom';

const WorkoutLogDetails = () => {
  const { workoutLogID } = useParams();
  const dispatch = useDispatch();
  const workoutLog = useSelector((state) => state.workoutLogs.currentLog);
  const status = useSelector((state) => state.workoutLogs.status);
  const error = useSelector((state) => state.workoutLogs.error);
  const [newSet, setNewSet] = useState({ setLogWeight: '', setLogReps: '', setLogRPE: '', exerciseLogID: null });

  useEffect(() => {
    if (workoutLogID) {
      dispatch(fetchWorkoutLogDetails(workoutLogID)).then((res) => {
        console.log("Fetched workout log details: ", res.payload); // Debugging line
      });
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

  const handleAddSetLog = (exerciseLogID) => {
    const setLogData = {
      ...newSet,
      exerciseLogID,
    };
    dispatch(addSetLog(setLogData));
    setNewSet({ setLogWeight: '', setLogReps: '', setLogRPE: '', exerciseLogID: null });
  };

  const handleDeleteSetLog = (setLogID) => {
    console.log("Deleting set log with ID:", setLogID); // Debugging line
    if (window.confirm('Are you sure you want to delete this set log?')) {
      dispatch(deleteSetLog(setLogID));
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
                    <li key={setLog.setLogID}>
                      Set {index + 1}: {setLog.setLogReps} reps @ {setLog.setLogRPE} RPE
                      <button onClick={() => handleDeleteSetLog(setLog.setLogID)}>
                        Delete Set
                      </button>
                      {console.log("Set Log ID: ", setLog.setLogID)} {/* Debugging */}
                    </li>
                  ))
                ) : (
                  <li>No sets recorded for this exercise.</li>
                )}
              </ul>
              <div>
                <h4>Add Set Log</h4>
                <input
                  type="number"
                  placeholder="Weight"
                  value={newSet.setLogWeight}
                  onChange={(e) => setNewSet({ ...newSet, setLogWeight: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Reps"
                  value={newSet.setLogReps}
                  onChange={(e) => setNewSet({ ...newSet, setLogReps: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="RPE"
                  value={newSet.setLogRPE}
                  onChange={(e) => setNewSet({ ...newSet, setLogRPE: e.target.value })}
                />
                <button onClick={() => handleAddSetLog(exerciseLog.exerciseLogID)}>
                  Add Set
                </button>
              </div>
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