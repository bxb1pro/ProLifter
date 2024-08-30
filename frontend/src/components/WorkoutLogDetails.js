import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkoutLogDetails, finishWorkoutLog } from '../features/workoutLogs/workoutLogSlice';
import { editExerciseLog, deleteExerciseLog } from '../features/exerciseLogs/exerciseLogSlice';
import { addSetLog, deleteSetLog, editSetLog } from '../features/setLogs/setLogSlice'; // Import editSetLog
import { useParams, useNavigate } from 'react-router-dom';

const WorkoutLogDetails = () => {
  const { workoutLogID } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const workoutLog = useSelector((state) => state.workoutLogs.currentLog);
  const status = useSelector((state) => state.workoutLogs.status);
  const error = useSelector((state) => state.workoutLogs.error);

  const [newSetData, setNewSetData] = useState({}); // Hold new set data per exercise log ID
  const [editMode, setEditMode] = useState(null); // Track which set log is in edit mode
  const [editSetData, setEditSetData] = useState({
    setLogWeight: '',
    setLogReps: '',
    setLogRPE: '',
    setLog1RM: ''
  });

  useEffect(() => {
    if (workoutLogID) {
      dispatch(fetchWorkoutLogDetails(workoutLogID));
    }
  }, [dispatch, workoutLogID]);

  const handleFinishWorkout = () => {
    const confirmed = window.confirm('Finish this workout?');

    if (confirmed) {
        dispatch(finishWorkoutLog(workoutLogID))
            .unwrap()
            .then(() => {
                navigate('/workout-logs'); // Redirect to the workout logs page after finishing the workout
            })
            .catch((error) => {
                console.error('Error finishing workout:', error);
                alert('Failed to finish the workout. Please try again.');
            });
    }
};

  const handleCompleteExercise = (exerciseLogID) => {
    if (window.confirm('Complete exercise?')) {
    dispatch(editExerciseLog({ exerciseLogID, exerciseLogCompleted: true })).then(() => {
      dispatch(fetchWorkoutLogDetails(workoutLogID)); // Refresh after marking exercise as complete
    });
   }
  };

  const handleDeleteExercise = (exerciseLogID) => {
    if (window.confirm('Are you sure you want to delete this exercise log?')) {
      dispatch(deleteExerciseLog(exerciseLogID)).then(() => {
        dispatch(fetchWorkoutLogDetails(workoutLogID)); // Refresh after deleting exercise
      });
    }
  };

  const handleAddSetLog = (exerciseLogID) => {
    const { setLogWeight, setLogReps } = newSetData[exerciseLogID];

    // Check if weight and reps are provided
    if (!setLogWeight || !setLogReps) {
        alert('Please enter both weight and reps before adding the set.');
        return; // Exit the function if either field is empty
    }

    const confirmed = window.confirm('Add set?');

    if (confirmed) {
        const setLogData = {
            ...newSetData[exerciseLogID],
            exerciseLogID,
        };

        dispatch(addSetLog(setLogData))
            .unwrap()
            .then(() => {
                setNewSetData((prevData) => ({
                    ...prevData,
                    [exerciseLogID]: { setLogWeight: '', setLogReps: '', setLogRPE: '', setLog1RM: '' },
                }));
                dispatch(fetchWorkoutLogDetails(workoutLogID)); // Refresh after adding set
            })
            .catch((error) => {
                console.error('Error adding set:', error);
                alert('Failed to add set. Please try again.');
            });
    }
};

  const handleDeleteSetLog = (setLogID) => {
    if (window.confirm('Are you sure you want to delete this set log?')) {
      dispatch(deleteSetLog(setLogID)).then(() => {
        dispatch(fetchWorkoutLogDetails(workoutLogID)); // Refresh after deleting set
      });
    }
  };

  const handleEditSetLog = (setLog) => {
    setEditMode(setLog.setLogID);
    setEditSetData({
      setLogWeight: setLog.setLogWeight || '',
      setLogReps: setLog.setLogReps || '',
      setLogRPE: setLog.setLogRPE || '',
      setLog1RM: setLog.setLog1RM || ''
    });
  };

  const handleSaveSetLog = (setLogID) => {
    dispatch(editSetLog({ ...editSetData, id: setLogID })).then(() => {
      setEditMode(null);
      dispatch(fetchWorkoutLogDetails(workoutLogID)); // Refresh after editing set
    });
  };

  const handleChangeNewSetData = (exerciseLogID, field, value) => {
    setNewSetData((prevData) => ({
      ...prevData,
      [exerciseLogID]: {
        ...prevData[exerciseLogID],
        [field]: value,
      },
    }));
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
                      {editMode === setLog.setLogID ? (
                        <div>
                          <input
                            type="number"
                            placeholder="Weight"
                            value={editSetData.setLogWeight}
                            onChange={(e) => setEditSetData({ ...editSetData, setLogWeight: e.target.value })}
                          />
                          <input
                            type="number"
                            placeholder="Reps"
                            value={editSetData.setLogReps}
                            onChange={(e) => setEditSetData({ ...editSetData, setLogReps: e.target.value })}
                          />
                          <input
                            type="number"
                            placeholder="RPE"
                            value={editSetData.setLogRPE}
                            onChange={(e) => setEditSetData({ ...editSetData, setLogRPE: e.target.value })}
                          />
                          <input
                            type="number"
                            placeholder="1RM"
                            value={editSetData.setLog1RM}
                            onChange={(e) => setEditSetData({ ...editSetData, setLog1RM: e.target.value })}
                          />
                          <button onClick={() => handleSaveSetLog(setLog.setLogID)}>Save</button>
                          <button onClick={() => setEditMode(null)}>Cancel</button>
                        </div>
                      ) : (
                        <div>
                          Set {index + 1}: {setLog.setLogWeight} kg, {setLog.setLogReps} reps @ {setLog.setLogRPE} RPE
                          <button onClick={() => handleEditSetLog(setLog)}>Edit</button>
                          <button onClick={() => handleDeleteSetLog(setLog.setLogID)}>
                            Delete Set
                          </button>
                        </div>
                      )}
                    </li>
                  ))
                ) : (
                  <li>No sets recorded for this exercise.</li>
                )}
              </ul>
              {/* Form to Add a New Set */}
              <div>
                <h4>Add Set Log</h4>
                <input
                  type="number"
                  placeholder="Weight"
                  value={newSetData[exerciseLog.exerciseLogID]?.setLogWeight || ''}
                  onChange={(e) => handleChangeNewSetData(exerciseLog.exerciseLogID, 'setLogWeight', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Reps"
                  value={newSetData[exerciseLog.exerciseLogID]?.setLogReps || ''}
                  onChange={(e) => handleChangeNewSetData(exerciseLog.exerciseLogID, 'setLogReps', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="RPE"
                  value={newSetData[exerciseLog.exerciseLogID]?.setLogRPE || ''}
                  onChange={(e) => handleChangeNewSetData(exerciseLog.exerciseLogID, 'setLogRPE', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="1RM"
                  value={newSetData[exerciseLog.exerciseLogID]?.setLog1RM || ''}
                  onChange={(e) => handleChangeNewSetData(exerciseLog.exerciseLogID, 'setLog1RM', e.target.value)}
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