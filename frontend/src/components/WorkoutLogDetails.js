import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkoutLogDetails, finishWorkoutLog } from '../features/workoutLogs/workoutLogSlice';
import { editExerciseLog, deleteExerciseLog } from '../features/exerciseLogs/exerciseLogSlice';
import { addSetLog, deleteSetLog, editSetLog } from '../features/setLogs/setLogSlice'; 
import { fetchExerciseByName } from '../features/exercises/exerciseSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, ListGroup, Form, InputGroup, Card, Modal, Row, Col } from 'react-bootstrap';
import './WorkoutLogDetails.css';

// Function to capitalise words from exercise database
const capitaliseWords = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const WorkoutLogDetails = () => {
  const { workoutLogID } = useParams(); // Get workoutLogID from URL
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const workoutLog = useSelector((state) => state.workoutLogs.currentLog);
  const status = useSelector((state) => state.workoutLogs.status);
  const error = useSelector((state) => state.workoutLogs.error);
  
  // State to track fetched exercise images
  const [exerciseImages, setExerciseImages] = useState({});

  // States for new and edited set logs
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

  // Fetch workout log details and related exercise images on component mount
  useEffect(() => {
    if (workoutLogID) {
      dispatch(fetchWorkoutLogDetails(workoutLogID)).then((response) => {
        const exerciseLogs = response.payload.ExerciseLogs;
        exerciseLogs.forEach((log) => {
          const encodedName = encodeURIComponent(log.Exercise.exerciseName);
          dispatch(fetchExerciseByName(encodedName)).then((action) => {
            setExerciseImages((prev) => ({
              ...prev,
              [log.Exercise.exerciseName]: action.payload.imageUrl,
            }));
          });
        });
      });
    }
  }, [dispatch, workoutLogID]);

  // Open and handle finish workout
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

  // Open and handle finish exercise
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

  // Open and handle deleting a set
  const handleOpenDeleteSetModal = (setLogID) => {
    setSetLogToDelete(setLogID);
    setShowDeleteSetModal(true);
  };

  const handleDeleteSetLog = () => {
    if (setLogToDelete) {
      // Capture current scroll position before deleting set
      const currentScrollPosition = window.scrollY;
  
      dispatch(deleteSetLog(setLogToDelete)).then(() => {
        // After deleting set restore scroll position
        dispatch(fetchWorkoutLogDetails(workoutLogID)).then(() => {
          window.scrollTo(0, currentScrollPosition);
        });
        setShowDeleteSetModal(false);
      });
    }
  };

  // Open and handle deleting an exercise
  const handleOpenDeleteExerciseModal = (exerciseLogID) => {
    setExerciseLogToDelete(exerciseLogID);
    setShowDeleteExerciseModal(true);
  };

  const handleDeleteExercise = () => {
    if (exerciseLogToDelete) {
      const currentScrollPosition = window.scrollY;
  
      dispatch(deleteExerciseLog(exerciseLogToDelete)).then(() => {
        dispatch(fetchWorkoutLogDetails(workoutLogID)).then(() => {
          window.scrollTo(0, currentScrollPosition);
        });
        setShowDeleteExerciseModal(false);
      });
    }
  };

  // Handle adding a set log
  const handleAddSetLog = (exerciseLogID) => {
    const currentScrollPosition = window.scrollY;
  
    const setData = newSetData[exerciseLogID] || {}; 
    const { setLogWeight, setLogReps, setLogRPE, setLog1RM } = setData;
  
    // Restrict user input to required data types
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
        dispatch(fetchWorkoutLogDetails(workoutLogID)).then(() => {
          window.scrollTo(0, currentScrollPosition);
        });
      })
      .catch((error) => {
        console.error('Error adding set:', error);
        alert('Failed to add set. Please try again.');
      });
  };

  // Handle editing a set log
  const handleEditSetLog = (setLog) => {
    setEditMode(setLog.setLogID);
    setEditSetData({
      setLogWeight: setLog.setLogWeight || '',
      setLogReps: setLog.setLogReps || '',
      setLogRPE: setLog.setLogRPE || '',
      setLog1RM: setLog.setLog1RM || ''
    });
  };

  // Saving a set log
  const handleSaveSetLog = (setLogID) => {
    const currentScrollPosition = window.scrollY;
  
    dispatch(editSetLog({ ...editSetData, id: setLogID })).then(() => {
      setEditMode(null);
      dispatch(fetchWorkoutLogDetails(workoutLogID)).then(() => {
        window.scrollTo(0, currentScrollPosition);
      });
    });
  };

  // Handle changes in new set data input fields
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
      <Row className="mb-4">
        {/* Header information for workout log details*/}
        <Col md={6}>
          <h2>Workout Log Details</h2>
          <p><strong>Date:</strong> {new Date(workoutLog.workoutLogDate).toLocaleDateString()}</p>
          <p><strong>Completed:</strong> {workoutLog.workoutLogCompleted ? 'Yes' : 'No'}</p>
        </Col>
        <Col md={6} className="text-end">
        <h3>Definitions</h3>
          <div className="definition">
            <p><strong>RPE: Rate of Perceived Exertion</strong></p>
            <p className="definition-description">1 being minimum, 10 being maximum</p>
          </div>
          <div className="definition">
            <p><strong>1RM: One Rep Max</strong></p>
            <p className="definition-description">The maximum weight lifted for one successful repetition</p>
          </div>
        </Col>
      </Row>

      {/* List of exercises for workout for user */}
      <h3>Exercises:</h3>
      <ListGroup as="ul">
        {workoutLog.ExerciseLogs && workoutLog.ExerciseLogs.length > 0 ? (
          workoutLog.ExerciseLogs.map((exerciseLog) => (
            <ListGroup.Item as="li" key={exerciseLog.exerciseLogID}>
              <Card className="mb-3 exercise-card">
                <Card.Img 
                // Exercise image called directly from API due to constantly refreshing image links
                  src={exerciseImages?.[exerciseLog.Exercise.exerciseName]} 
                  alt={exerciseLog.Exercise.exerciseName}
                  onError={(e) => { 
                    console.error('Failed to load image:', exerciseImages?.[exerciseLog.Exercise.exerciseName]); 
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
                  
                  {/* Display set logs for each exercise log in the workout log */}
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
                    {/* Form to add a new set log */}
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