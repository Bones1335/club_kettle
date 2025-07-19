const API_BASE = '/api';

export class ApiClient {
    constructor() {
        this.baseUrl = API_BASE;
    }

    getAuthToken() {
        return localStorage.getItem('authToken');
    }

    async request(endpoint, options = {}) {
        const token = this.getAuthToken();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            ...options
        };

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, config);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            const contentLength = response.headers.get('content-length');

            if (!contentType || contentLength == '0') {
                return null;
            }

            if (contentType && contentType.includes('application/json')) {
                const text = await response.text();
                return text ? JSON.parse(text) : null;
            }

            return await response.text();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }

    async get(endpoint) {
        return this.request(endpoint);
    }
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE',
        });
    }
}

export const apiClient = new ApiClient();