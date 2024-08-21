import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExerciseById } from '../features/exercises/exerciseSlice';
import { fetchUserCustomWorkouts } from '../features/customWorkouts/customWorkoutSlice';
import { linkExerciseToCustomWorkout } from '../features/customWorkouts/customWorkoutSlice';
import { fetchPresetWorkouts } from '../features/presetWorkouts/presetWorkoutSlice'; // New import
import { linkExerciseToPresetWorkout } from '../features/presetWorkouts/presetWorkoutSlice'; // New import
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
        if (selectedPresetWorkout) {
            dispatch(linkExerciseToPresetWorkout({ presetWorkoutID: selectedPresetWorkout, exerciseID: id }));
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
                <button onClick={handleLinkExerciseToPresetWorkout} disabled={!selectedPresetWorkout}>
                    Add to Preset Workout
                </button>
            </div>
        </div>
    );
};

export default ExerciseDetails;