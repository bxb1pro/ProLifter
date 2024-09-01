const axios = require('axios');

const exerciseApi = axios.create({
    baseURL: 'https://exercisedb.p.rapidapi.com',
    headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST,
    }
});

const getAllExercises = async (limit = 9999) => { // Limit maximum to get all exercises
    try {
        const response = await exerciseApi.get(`/exercises?limit=${limit}`);
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

const getExercisesByBodyPart = async (bodyPart, limit = 9999) => {
    try {
        const response = await exerciseApi.get(`/exercises/bodyPart/${bodyPart}?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching exercises for body part ${bodyPart}:`, error);
        throw new Error(`Could not fetch exercises for body part ${bodyPart}`);
    }
};

const getBodyPartList = async () => {
    try {
        const response = await exerciseApi.get('/exercises/bodyPartList');
        return response.data;
    } catch (error) {
        console.error('Error fetching body part list:', error);
        throw new Error('Could not fetch body part list');
    }
};

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