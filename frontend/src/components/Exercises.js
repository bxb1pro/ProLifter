import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExercises } from '../features/exercises/exerciseSlice';
import './Exercises.css';

const Exercises = () => {
    const dispatch = useDispatch();
    const { exercises, isLoading, error } = useSelector((state) => state.exercises);

    useEffect(() => {
        dispatch(fetchExercises());
    }, [dispatch]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="exercises-grid">
            {exercises.map((exercise) => (
                <div key={exercise.id} className="exercise-card">
                    <img src={exercise.gifUrl} alt={exercise.name} className="exercise-image" />
                    <h3>{exercise.name}</h3>
                    <p>Body Part: {exercise.bodyPart}</p>
                    <p>Equipment: {exercise.equipment}</p>
                </div>
            ))}
        </div>
    );
};

export default Exercises;