import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExerciseById } from '../features/exercises/exerciseSlice';
import { fetchUserCustomWorkouts } from '../features/customWorkouts/customWorkoutSlice';
import { linkExerciseToCustomWorkout } from '../features/customWorkouts/customWorkoutSlice';
import { fetchPresetWorkouts, linkExerciseToPresetWorkout } from '../features/presetWorkouts/presetWorkoutSlice';
import { useParams } from 'react-router-dom';
import './ExerciseDetails.css';

const ExerciseDetails = () => {
    const { id } = useParams();  // Get the exercise ID from the URL
    const dispatch = useDispatch();
    const { selectedExercise, isLoading, error } = useSelector((state) => state.exercises);
    const customWorkouts = useSelector((state) => state.customWorkouts.workouts); // Fetch custom workouts
    const presetWorkouts = useSelector((state) => state.presetWorkouts.workouts); // Fetch preset workouts
    const [selectedCustomWorkout, setSelectedCustomWorkout] = useState(''); // State to manage selected custom workout
    const [selectedPresetWorkout, setSelectedPresetWorkout] = useState(''); // State to manage selected preset workout
    const [defaultSets, setDefaultSets] = useState(''); // State to manage default sets
    const [defaultReps, setDefaultReps] = useState(''); // State to manage default reps
    const [defaultRPE, setDefaultRPE] = useState(''); // State to manage default RPE

    useEffect(() => {
        dispatch(fetchExerciseById(id));
        dispatch(fetchUserCustomWorkouts()); // Fetch user's custom workouts
        dispatch(fetchPresetWorkouts()); // Fetch all preset workouts
    }, [dispatch, id]);

    const handleLinkExerciseToCustomWorkout = () => {
        if (selectedCustomWorkout) {
            dispatch(linkExerciseToCustomWorkout({ customWorkoutID: selectedCustomWorkout, exerciseID: id }));
        }
    };

    const handleLinkExerciseToPresetWorkout = () => {
        if (selectedPresetWorkout && defaultSets && defaultReps) {
            dispatch(linkExerciseToPresetWorkout({ 
                presetWorkoutID: selectedPresetWorkout, 
                exerciseID: id,
                defaultSets: parseInt(defaultSets),
                defaultReps: parseInt(defaultReps),
                defaultRPE: parseFloat(defaultRPE) || null 
            }));
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    if (!selectedExercise) return <p>Exercise not found</p>;

    return (
        <div className="exercise-details">
            <img src={selectedExercise.gifUrl} alt={selectedExercise.name} className="exercise-image" />
            <h2>{selectedExercise.name}</h2>
            <p>Body Part: {selectedExercise.bodyPart}</p>
            <p>Equipment: {selectedExercise.equipment}</p>
            <p>Target Muscle: {selectedExercise.target}</p>

            {/* Add exercise to custom workout */}
            <div>
                <h3>Add to Custom Workout</h3>
                <select value={selectedCustomWorkout} onChange={(e) => setSelectedCustomWorkout(e.target.value)}>
                    <option value="">Select a workout</option>
                    {customWorkouts.map((workout) => (
                        <option key={workout.customWorkoutID} value={workout.customWorkoutID}>
                            {workout.customWorkoutName}
                        </option>
                    ))}
                </select>
                <button onClick={handleLinkExerciseToCustomWorkout} disabled={!selectedCustomWorkout}>
                    Add to Custom Workout
                </button>
            </div>

            {/* Add exercise to preset workout */}
            <div>
                <h3>Add to Preset Workout</h3>
                <select value={selectedPresetWorkout} onChange={(e) => setSelectedPresetWorkout(e.target.value)}>
                    <option value="">Select a workout</option>
                    {presetWorkouts.map((workout) => (
                        <option key={workout.presetWorkoutID} value={workout.presetWorkoutID}>
                            {workout.presetWorkoutName}
                        </option>
                    ))}
                </select>

                {/* Input fields for default values */}
                <div>
                    <label>Default Sets: </label>
                    <input 
                        type="number" 
                        value={defaultSets} 
                        onChange={(e) => setDefaultSets(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Default Reps: </label>
                    <input 
                        type="number" 
                        value={defaultReps} 
                        onChange={(e) => setDefaultReps(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Default RPE: </label>
                    <input 
                        type="number" 
                        value={defaultRPE} 
                        onChange={(e) => setDefaultRPE(e.target.value)} 
                    />
                </div>

                <button onClick={handleLinkExerciseToPresetWorkout} disabled={!selectedPresetWorkout || !defaultSets || !defaultReps}>
                    Add to Preset Workout
                </button>
            </div>
        </div>
    );
};

export default ExerciseDetails;