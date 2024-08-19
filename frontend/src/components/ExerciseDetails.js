import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExerciseById } from '../features/exercises/exerciseSlice';
import { useParams } from 'react-router-dom';
import './ExerciseDetails.css';

const ExerciseDetails = () => {
    const { id } = useParams();  // Get the exercise ID from the URL
    const dispatch = useDispatch();
    const { selectedExercise, isLoading, error } = useSelector((state) => state.exercises);

    useEffect(() => {
        dispatch(fetchExerciseById(id));
    }, [dispatch, id]);

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
        </div>
    );
};

export default ExerciseDetails;