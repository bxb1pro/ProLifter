import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExercises, fetchExercisesByBodyPart, fetchBodyPartList } from '../features/exercises/exerciseSlice';
import { Link } from 'react-router-dom';
import { Form, Container, Row, Col, Card } from 'react-bootstrap';
import './Exercises.css';

const Exercises = () => {
    const dispatch = useDispatch();
    const { exercises, bodyPartList, isLoading, error } = useSelector((state) => state.exercises);
    const [bodyPart, setBodyPart] = useState('');

    useEffect(() => {
        dispatch(fetchBodyPartList());
    }, [dispatch]);

    useEffect(() => {
        if (bodyPart) {
            dispatch(fetchExercisesByBodyPart({ bodyPart }));
        } else {
            dispatch(fetchExercises());
        }
    }, [dispatch, bodyPart]);

    const handleBodyPartChange = (event) => {
        setBodyPart(event.target.value);
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Container>
            <Row className="mb-4">
                <Col md={4} className="offset-md-4">
                    <Form.Group controlId="bodyPart">
                        <Form.Label>Filter by Body Part:</Form.Label>
                        <Form.Control as="select" value={bodyPart} onChange={handleBodyPartChange}>
                            <option value="">All</option>
                            {bodyPartList.map((part) => (
                                <option key={part} value={part}>
                                    {part.charAt(0).toUpperCase() + part.slice(1)}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                {exercises.map((exercise) => (
                    <Col md={4} lg={3} className="mb-4" key={exercise.id}>
                        <Link to={`/exercises/${exercise.id}`} className="exercise-card-link">
                            <Card className="exercise-card h-100">
                                <Card.Img variant="top" src={exercise.gifUrl} alt={exercise.name} className="exercise-image" />
                                <Card.Body>
                                    <Card.Title>{exercise.name}</Card.Title>
                                    <Card.Text>
                                        <strong>Body Part:</strong> {exercise.bodyPart}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Equipment:</strong> {exercise.equipment}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Exercises;