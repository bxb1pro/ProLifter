import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExerciseById } from '../features/exercises/exerciseSlice';
import { fetchUserCustomWorkouts, linkExerciseToCustomWorkout, clearError as clearCustomWorkoutError } from '../features/customWorkouts/customWorkoutSlice';
import { fetchPresetWorkouts, linkExerciseToPresetWorkout, clearError as clearPresetWorkoutError } from '../features/presetWorkouts/presetWorkoutSlice';
import { useParams } from 'react-router-dom';
import './ExerciseDetails.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ExerciseDetails = () => {
    const { id } = useParams(); // Extract exercise ID from route parameters
    const dispatch = useDispatch();
    const { selectedExercise, isLoading, error } = useSelector((state) => state.exercises);
    const customWorkouts = useSelector((state) => state.customWorkouts.workouts);
    const presetWorkouts = useSelector((state) => state.presetWorkouts.workouts);
    const [selectedCustomWorkout, setSelectedCustomWorkout] = useState('');
    const [selectedPresetWorkout, setSelectedPresetWorkout] = useState('');
    const [defaultSets, setDefaultSets] = useState('');
    const [defaultReps, setDefaultReps] = useState('');
    const [defaultRPE, setDefaultRPE] = useState('');
    const [modal, setModal] = useState({ show: false, message: '', type: '' });
    const role = useSelector((state) => state.auth.role); // Get user role from the Redux state

    // Fetch exercise details, custom workouts, and preset workouts when component mounts
    useEffect(() => {
        dispatch(fetchExerciseById(id));
        dispatch(fetchUserCustomWorkouts());
        dispatch(fetchPresetWorkouts());
    }, [dispatch, id]);

    const handleLinkExerciseToCustomWorkout = () => {
        if (selectedCustomWorkout) {
            dispatch(linkExerciseToCustomWorkout({ customWorkoutID: selectedCustomWorkout, exerciseID: id }))
                .unwrap()
                .then(() => {
                    setModal({ show: true, message: 'Exercise added to custom workout successfully.', type: 'success' });
                })
                .catch((error) => {
                    console.error('Error adding exercise to custom workout:', error);
                    const errorMessage = typeof error.error === 'object' ? JSON.stringify(error.error) : error.error || 'Unknown error';
                    setModal({ show: true, message: `Failed to add exercise to custom workout: ${errorMessage}`, type: 'danger' });
                });
        }
    };

    // Handle linking exercise to a preset workout
    const handleLinkExerciseToPresetWorkout = () => {
        if (selectedPresetWorkout && defaultSets && defaultReps) {
            dispatch(linkExerciseToPresetWorkout({ 
                presetWorkoutID: selectedPresetWorkout, 
                exerciseID: id,
                defaultSets: parseInt(defaultSets),
                defaultReps: parseInt(defaultReps),
                defaultRPE: parseFloat(defaultRPE) || null 
            })).unwrap()
              .then(() => {
                  setModal({ show: true, message: 'Exercise added successfully.', type: 'success' });
              })
              .catch((error) => {
                  console.error('Error adding exercise:', error);
                  setModal({ show: true, message: `Failed to add exercise: ${error.error || 'Unknown error'}`, type: 'danger' });
              });
        }
    };

    const handleCloseModal = () => {
        setModal({ ...modal, show: false });
        dispatch(clearCustomWorkoutError());
        dispatch(clearPresetWorkoutError());
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    if (!selectedExercise) return <p>Exercise not found</p>;

    return (
        <div className="container exercise-details mt-5">
            <div className="row">
                <div className="col-md-4">
                    <img 
                        src={selectedExercise.gifUrl} 
                        alt={selectedExercise.name} 
                        onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src = "/images/placeholder.jpg"; 
                        }} 
                        className="img-fluid exercise-image" 
                    />
                </div>
                <div className="col-md-8">
                    <h2 className="mb-4">{selectedExercise.name}</h2>
                    <p><strong>Body Part:</strong> {selectedExercise.bodyPart}</p>
                    <p><strong>Equipment:</strong> {selectedExercise.equipment}</p>
                    <p><strong>Target Muscle:</strong> {selectedExercise.target}</p>
                    <p><strong>Secondary Muscles:</strong> {(selectedExercise.secondaryMuscles || []).join(', ')}</p>
                    <h4 className="mt-4">Instructions:</h4>
                    <ol>
                        {(selectedExercise.instructions || []).map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                        ))}
                    </ol>
                </div>
            </div>

            {/* Display custom workout options if user role is 'user' */}
            {role === 'user' && (
                <div className="mt-5">
                    <h3>Add to Custom Workout</h3>
                    <div className="input-group mb-3">
                        <select 
                            className="form-select" 
                            value={selectedCustomWorkout} 
                            onChange={(e) => setSelectedCustomWorkout(e.target.value)}
                        >
                            <option value="">Select a workout</option>
                            {customWorkouts.map((workout) => (
                                <option key={workout.customWorkoutID} value={workout.customWorkoutID}>
                                    {workout.customWorkoutName}
                                </option>
                            ))}
                        </select>
                        <button 
                            className="btn btn-primary" 
                            onClick={handleLinkExerciseToCustomWorkout} 
                            disabled={!selectedCustomWorkout}
                        >
                            Add to Custom Workout
                        </button>
                    </div>
                </div>
            )}

            {/* Display preset workout options if user role is 'admin' or 'superadmin' */}
            {(role === 'admin' || role === 'superadmin') && (
                <div className="mt-5">
                    <h3>Add to Preset Workout</h3>
                    <div className="input-group mb-3">
                        <select 
                            className="form-select" 
                            value={selectedPresetWorkout} 
                            onChange={(e) => setSelectedPresetWorkout(e.target.value)}
                        >
                            <option value="">Select a workout</option>
                            {presetWorkouts.map((workout) => (
                                <option key={workout.presetWorkoutID} value={workout.presetWorkoutID}>
                                    {workout.presetWorkoutName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Default Sets:</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            value={defaultSets} 
                            onChange={(e) => setDefaultSets(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Default Reps:</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            value={defaultReps} 
                            onChange={(e) => setDefaultReps(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Default RPE:</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            value={defaultRPE} 
                            onChange={(e) => setDefaultRPE(e.target.value)} 
                        />
                    </div>
                    <button 
                        className="btn btn-primary" 
                        onClick={handleLinkExerciseToPresetWorkout} 
                        disabled={!selectedPresetWorkout || !defaultSets || !defaultReps}
                    >
                        Add to Preset Workout
                    </button>
                </div>
            )}

            {/* Bootstrap Modal for Alerts */}
            <div 
                className={`modal fade ${modal.show ? 'show d-block' : ''}`} 
                tabIndex="-1" 
                role="dialog" 
                style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}  //darkens background
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className={`modal-header ${modal.type === 'success' ? 'bg-success' : 'bg-danger'}`}>
                            <h5 className="modal-title text-white">{modal.type === 'success' ? 'Success' : 'Error'}</h5>
                            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                        </div>
                        <div className="modal-body">
                            <p>{modal.message}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExerciseDetails;