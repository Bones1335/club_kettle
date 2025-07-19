import { apiClient } from '../api/client.js';

export class ExerciseService {
    async createExercises(exerciseData) {
        return await apiClient.post('/exercises', exerciseData);
    }
    async getExercises() {
        return await apiClient.get('/exercises');
    }

    async getSingleExercise(id) {
        return await apiClient.get(`/exercises/${id}`);
    }

    async updateExercise(id, exerciseData) {
        return await apiClient.put(`/exercises/${id}`, exerciseData);
    }

    async deleteExercise(id) {
        return await apiClient.delete(`/exercises/${id}`);
    }
}

export const exerciseService = new ExerciseService();