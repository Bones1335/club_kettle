import { apiClient } from '../api/client.js';

export class WorkoutService {
    constructor() {
        this.currentWorkout = null;
        this.workoutStartTime = null;
        this.durationInterval = null;
    }

    async createWorkouts(workoutData) {
        return await apiClient.post('/workouts', workoutData);
    }

    async getWorkouts() {
        return await apiClient.get('/workouts');
    }

    async getWorkout(id) {
        return await apiClient.get(`/workouts/${id}`);
    }

    async updateWorkout(id, workoutData) {
        return await apiClient.put(`/workouts/${id}`, workoutData);
    }

    async deleteWorkout(id) {
        return await apiClient.delete(`/workouts/${id}`);
    }
}

export const workoutService = new WorkoutService();