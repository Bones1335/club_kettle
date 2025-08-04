import { apiClient } from '../api/client.js';

export class UserService {
    async createUser(userData) {
        return await apiClient.post('/users', userData);
    }

    async getUser() {
        return await apiClient.get('/users');
    }

    async updateUser(id, userData) {
        return await apiClient.put(`/users/${id}`, userData);
    }

    async deleteUser(id) {
        return await apiClient.delete(`/users/${id}`);
    }
}

export const userService = new UserService();