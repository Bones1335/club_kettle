import { authService } from "./services/auth.js";

class WorkoutApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin(e);
        });
    }

    checkAuthStatus() {
        if (authService.isAuthenticated()) {
            // showScreen('dashboard-screen');
            // this.loadExercises();
        } else {
            showScreen('login-screen');
        }
    }

    async handleLogin(e) {
        clearError('login-error');

        const formData = new FormData(e.target);
        const email = formData.get('login-email');
        const password = formData.get('login-password');

        try {
            await authService.login(email, password);
            // showScreen('dashboard-screen');
            // this.loadExercises();
        } catch (error) {
            showError('login-error', error.message);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WorkoutApp();
});

