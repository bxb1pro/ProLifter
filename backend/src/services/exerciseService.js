const axios = require('axios');

const exerciseApi = axios.create({
    baseURL: 'https://exercisedb.p.rapidapi.com',
    headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST,
    }
});

const getAllExercises = async () => {
    try {
        const response = await exerciseApi.get('/exercises');
        return response.data;
    } catch (error) {
        console.error('Error fetching exercises:', error);
        throw new Error('Could not fetch exercises');
    }
};

const getExerciseById = async (id) => {
    try {
        const response = await exerciseApi.get(`/exercises/exercise/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching exercise with ID ${id}:`, error);
        throw new Error(`Could not fetch exercise with ID ${id}`);
    }
};

// More functions later, check ExerciseDB endpoints for exact info

module.exports = {
    getAllExercises,
    getExerciseById,
};