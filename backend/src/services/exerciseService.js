const axios = require('axios');

// Details for API keys in .env file
const exerciseApi = axios.create({
    baseURL: 'https://exercisedb.p.rapidapi.com',
    headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST,
    }
});

// Get all exercises from API
const getAllExercises = async (limit = 9999) => { // Limit maximum to get all exercises
    try {
        const response = await exerciseApi.get(`/exercises?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching exercises:', error);
        throw new Error('Could not fetch exercises');
    }
};

// Get an exercise via ID from API
const getExerciseById = async (id) => {
    try {
        const response = await exerciseApi.get(`/exercises/exercise/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching exercise with ID ${id}:`, error);
        throw new Error(`Could not fetch exercise with ID ${id}`);
    }
};

// Get exercises by bodypart from the API
const getExercisesByBodyPart = async (bodyPart, limit = 9999) => {
    try {
        const response = await exerciseApi.get(`/exercises/bodyPart/${bodyPart}?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching exercises for body part ${bodyPart}:`, error);
        throw new Error(`Could not fetch exercises for body part ${bodyPart}`);
    }
};

// Get a list of bodyparts used from the API
const getBodyPartList = async () => {
    try {
        const response = await exerciseApi.get('/exercises/bodyPartList');
        return response.data;
    } catch (error) {
        console.error('Error fetching body part list:', error);
        throw new Error('Could not fetch body part list');
    }
};

// Get an exercise by name from the API
const getExerciseByName = async (name) => {
    try {
        const response = await exerciseApi.get(`/exercises/name/${encodeURIComponent(name)}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching exercise with name ${name}:`, error);
        throw new Error(`Could not fetch exercise with name ${name}`);
    }
};

module.exports = {
    getAllExercises,
    getExerciseById,
    getExercisesByBodyPart,
    getBodyPartList,
    getExerciseByName,
};