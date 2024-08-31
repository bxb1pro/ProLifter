import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkoutLogDetails, finishWorkoutLog } from '../features/workoutLogs/workoutLogSlice';
import { editExerciseLog, deleteExerciseLog } from '../features/exerciseLogs/exerciseLogSlice';
import { addSetLog, deleteSetLog, editSetLog } from '../features/setLogs/setLogSlice'; 
import { useParams, useNavigate } from 'react-router-dom';
import { Button, ListGroup, Form, InputGroup, Card, Modal, Row, Col } from 'react-bootstrap';
import './WorkoutLogDetails.css';

const capitaliseWords = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const WorkoutLogDetails = () => {
  const { workoutLogID } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const workoutLog = useSelector((state) => state.workoutLogs.currentLog);
  const status = useSelector((state) => state.workoutLogs.status);
  const error = useSelector((state) => state.workoutLogs.error);

  const [newSetData, setNewSetData] = useState({}); 
  const [editMode, setEditMode] = useState(null); 
  const [editSetData, setEditSetData] = useState({
    setLogWeight: '',
    setLogReps: '',
    setLogRPE: '',
    setLog1RM: ''
  });

  const [showDeleteSetModal, setShowDeleteSetModal] = useState(false);
  const [setLogToDelete, setSetLogToDelete] = useState(null);

  const [showDeleteExerciseModal, setShowDeleteExerciseModal] = useState(false);
  const [exerciseLogToDelete, setExerciseLogToDelete] = useState(null);

  const [showFinishExerciseModal, setShowFinishExerciseModal] = useState(false);
  const [exerciseLogToFinish, setExerciseLogToFinish] = useState(null);

  const [showFinishWorkoutModal, setShowFinishWorkoutModal] = useState(false);

  useEffect(() => {
    if (workoutLogID) {
      dispatch(fetchWorkoutLogDetails(workoutLogID)).then((response) => {
        console.log('Workout Log Details:', response.payload); // Debugging line
        const exerciseLogs = response.payload.ExerciseLogs;
        exerciseLogs.forEach(log => {
          console.log('Exercise Image URL:', log.Exercise.exerciseImageUrl); // Debugging line
        });
      });
    }
  }, [dispatch, workoutLogID]);

  const handleOpenFinishWorkoutModal = () => {
    setShowFinishWorkoutModal(true);
  };

  const handleFinishWorkout = () => {
    dispatch(finishWorkoutLog(workoutLogID))
      .unwrap()
      .then(() => {
        navigate('/workout-logs'); 
        setShowFinishWorkoutModal(false);
      })
      .catch((error) => {
        console.error('Error finishing workout:', error);
        alert('Failed to finish the workout. Please try again.');
      });
  };

  const handleOpenFinishExerciseModal = (exerciseLogID) => {
    setExerciseLogToFinish(exerciseLogID);
    setShowFinishExerciseModal(true);
  };

  const handleFinishExercise = () => {
    if (exerciseLogToFinish) {
      dispatch(editExerciseLog({ exerciseLogID: exerciseLogToFinish, exerciseLogCompleted: true })).then(() => {
        dispatch(fetchWorkoutLogDetails(workoutLogID));
        setShowFinishExerciseModal(false);
      });
    }
  };

  const handleOpenDeleteSetModal = (setLogID) => {
    setSetLogToDelete(setLogID);
    setShowDeleteSetModal(true);
  };

  const handleDeleteSetLog = () => {
    if (setLogToDelete) {
      dispatch(deleteSetLog(setLogToDelete)).then(() => {
        dispatch(fetchWorkoutLogDetails(workoutLogID));
        setShowDeleteSetModal(false);
      });
    }
  };

  const handleOpenDeleteExerciseModal = (exerciseLogID) => {
    setExerciseLogToDelete(exerciseLogID);
    setShowDeleteExerciseModal(true);
  };

  const handleDeleteExercise = () => {
    if (exerciseLogToDelete) {
      dispatch(deleteExerciseLog(exerciseLogToDelete)).then(() => {
        dispatch(fetchWorkoutLogDetails(workoutLogID));
        setShowDeleteExerciseModal(false);
      });
    }
  };

  const handleAddSetLog = (exerciseLogID) => {
    const setData = newSetData[exerciseLogID] || {}; 
    const { setLogWeight, setLogReps, setLogRPE, setLog1RM } = setData;
  
    if (!setLogWeight || !setLogReps || isNaN(setLogWeight) || isNaN(setLogReps) || setLogWeight <= 0 || setLogReps <= 0) {
      alert('Please enter valid numeric values for both weight and reps, and ensure they are greater than 0.');
      return;
    }
  
    const setLogData = {
      exerciseLogID,
      setLogWeight: parseFloat(setLogWeight),
      setLogReps: parseInt(setLogReps, 10),
      setLogRPE: setLogRPE ? parseFloat(setLogRPE) : null,
      setLog1RM: setLog1RM ? parseFloat(setLog1RM) : null,
    };
  
    dispatch(addSetLog(setLogData))
      .unwrap()
      .then(() => {
        setNewSetData((prevData) => ({
          ...prevData,
          [exerciseLogID]: { setLogWeight: '', setLogReps: '', setLogRPE: '', setLog1RM: '' },
        }));
        dispatch(fetchWorkoutLogDetails(workoutLogID));
      })
      .catch((error) => {
        console.error('Error adding set:', error);
        alert('Failed to add set. Please try again.');
      });
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
      dispatch(fetchWorkoutLogDetails(workoutLogID));
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
    <section className="container mt-4 workout-log-details">
      <h2 className="mb-4">Workout Log Details</h2>
      <p><strong>Date:</strong> {new Date(workoutLog.workoutLogDate).toLocaleDateString()}</p>
      <p><strong>Completed:</strong> {workoutLog.workoutLogCompleted ? 'Yes' : 'No'}</p>
      <h3>Exercises:</h3>
      <ListGroup as="ul">
        {workoutLog.ExerciseLogs && workoutLog.ExerciseLogs.length > 0 ? (
          workoutLog.ExerciseLogs.map((exerciseLog) => (
            <ListGroup.Item as="li" key={exerciseLog.exerciseLogID}>
              <Card className="mb-3 exercise-card">
                <Card.Img 
                  src={exerciseLog.Exercise.exerciseImageUrl} 
                  alt={exerciseLog.Exercise.exerciseName}
                  onError={(e) => { 
                    console.error('Failed to load image:', exerciseLog.Exercise.exerciseImageUrl); // Debugging line
                    e.target.onerror = null; 
                    e.target.src = "/images/placeholder.jpg"; 
                  }} 
                />
                <Card.Body className="exercise-card-body">
                  <div className="exercise-card-title">
                    <h5>{capitaliseWords(exerciseLog.Exercise.exerciseName)}</h5>
                    <p className="mb-1"><strong>Body Part:</strong> {capitaliseWords(exerciseLog.Exercise.exerciseBodypart)}</p>
                    <p className="mb-1"><strong>Equipment:</strong> {capitaliseWords(exerciseLog.Exercise.exerciseEquipment)}</p>
                  </div>
                  <Card.Text className="mt-2">
                  <ol>
                    {exerciseLog.Exercise.exerciseDescription.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                  </Card.Text>
                  <Card.Text>Status: {exerciseLog.exerciseLogCompleted ? 'Completed' : 'Incomplete'}</Card.Text>
                  {!exerciseLog.exerciseLogCompleted && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleOpenFinishExerciseModal(exerciseLog.exerciseLogID)}
                      className="me-2"
                    >
                      Mark as Completed
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleOpenDeleteExerciseModal(exerciseLog.exerciseLogID)}
                  >
                    Delete Exercise
                  </Button>

                  <ListGroup as="ul" className="mt-3">
                    {exerciseLog.SetLogs && exerciseLog.SetLogs.length > 0 ? (
                      exerciseLog.SetLogs
                        .slice() // Create a copy of the array to avoid mutating the original
                        .sort((a, b) => a.setLogID - b.setLogID) // Sort by setLogID
                        .map((setLog, index) => (
                          <ListGroup.Item as="li" key={setLog.setLogID}>
                            {editMode === setLog.setLogID ? (
                              <div>
                                <InputGroup className="mb-2">
                                  <Form.Control
                                    type="number"
                                    placeholder="Weight"
                                    value={editSetData.setLogWeight}
                                    onChange={(e) => setEditSetData({ ...editSetData, setLogWeight: e.target.value })}
                                  />
                                  <Form.Control
                                    type="number"
                                    placeholder="Reps"
                                    value={editSetData.setLogReps}
                                    onChange={(e) => setEditSetData({ ...editSetData, setLogReps: e.target.value })}
                                  />
                                  <Form.Control
                                    type="number"
                                    placeholder="RPE"
                                    value={editSetData.setLogRPE}
                                    onChange={(e) => setEditSetData({ ...editSetData, setLogRPE: e.target.value })}
                                  />
                                  <Form.Control
                                    type="number"
                                    placeholder="1RM"
                                    value={editSetData.setLog1RM}
                                    onChange={(e) => setEditSetData({ ...editSetData, setLog1RM: e.target.value })}
                                  />
                                </InputGroup>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleSaveSetLog(setLog.setLogID)}
                                  className="me-2"
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => setEditMode(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <Card.Text className="set-log-info">
                                <strong className="set-log-title">SET {index + 1}:</strong> 
                                <span className="set-log-item"><strong>Weight:</strong> {setLog.setLogWeight || '-'} kg</span>
                                <span className="set-log-item"><strong>Reps:</strong> {setLog.setLogReps || '-'} reps</span>
                                <span className="set-log-item"><strong>RPE:</strong> {setLog.setLogRPE || '-'}</span>
                                <span className="set-log-item"><strong>1RM:</strong> {setLog.setLog1RM || '-'}</span>
                                <Button
                                  variant="warning"
                                  size="sm"
                                  onClick={() => handleEditSetLog(setLog)}
                                  className="ms-2"
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleOpenDeleteSetModal(setLog.setLogID)}
                                  className="ms-2"
                                >
                                  Delete Set
                                </Button>
                              </Card.Text>
                            )}
                          </ListGroup.Item>
                        ))
                    ) : (
                      <ListGroup.Item as="li">No sets recorded for this exercise.</ListGroup.Item>
                    )}
                  </ListGroup>

                  <div className="mt-3">
                    <h5>Add Set Log</h5>
                    <InputGroup className="mb-2">
                      <Form.Control
                        type="number"
                        placeholder="Weight"
                        value={newSetData[exerciseLog.exerciseLogID]?.setLogWeight || ''}
                        onChange={(e) => handleChangeNewSetData(exerciseLog.exerciseLogID, 'setLogWeight', e.target.value)}
                      />
                      <Form.Control
                        type="number"
                        placeholder="Reps"
                        value={newSetData[exerciseLog.exerciseLogID]?.setLogReps || ''}
                        onChange={(e) => handleChangeNewSetData(exerciseLog.exerciseLogID, 'setLogReps', e.target.value)}
                      />
                      <Form.Control
                        type="number"
                        placeholder="RPE (Optional)"
                        value={newSetData[exerciseLog.exerciseLogID]?.setLogRPE || ''}
                        onChange={(e) => handleChangeNewSetData(exerciseLog.exerciseLogID, 'setLogRPE', e.target.value)}
                      />
                      <Form.Control
                        type="number"
                        placeholder="1RM (Optional)"
                        value={newSetData[exerciseLog.exerciseLogID]?.setLog1RM || ''}
                        onChange={(e) => handleChangeNewSetData(exerciseLog.exerciseLogID, 'setLog1RM', e.target.value)}
                      />
                    </InputGroup>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAddSetLog(exerciseLog.exerciseLogID)}
                      disabled={
                        !newSetData[exerciseLog.exerciseLogID]?.setLogWeight || 
                        !newSetData[exerciseLog.exerciseLogID]?.setLogReps
                      }
                    >
                      Add Set
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </ListGroup.Item>
          ))
        ) : (
          <p>No exercises found for this workout log.</p>
        )}
      </ListGroup>
      {!workoutLog.workoutLogCompleted && (
        <Button variant="success" className="mt-4" onClick={handleOpenFinishWorkoutModal}>
          Finish Workout
        </Button>
      )}

      {/* Delete Set Log Modal */}
      <Modal show={showDeleteSetModal} onHide={() => setShowDeleteSetModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this set log? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteSetModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteSetLog}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Exercise Log Modal */}
      <Modal show={showDeleteExerciseModal} onHide={() => setShowDeleteExerciseModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this exercise log? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteExerciseModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteExercise}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Finish Exercise Modal */}
      <Modal show={showFinishExerciseModal} onHide={() => setShowFinishExerciseModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Finish</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to mark this exercise as completed?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFinishExerciseModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleFinishExercise}>
            Finish Exercise
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Finish Workout Modal */}
      <Modal show={showFinishWorkoutModal} onHide={() => setShowFinishWorkoutModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Finish</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to finish this workout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFinishWorkoutModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleFinishWorkout}>
            Finish Workout
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default WorkoutLogDetails;