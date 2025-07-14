import { authService } from "./services/auth.js";
import { exerciseService } from "./services/exercises.js";
import { workoutService } from "./services/workouts.js";
import { renderExercises, renderWorkouts } from "./ui/components.js";
import { showScreen, showError, clearError } from "./ui/screens.js";

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

        document.getElementById('exercise-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleCreateExercises(e);
        });

        document.getElementById('workout-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleCreateWorkout(e);
        });

        this.setupNavigation();
    }

    setupNavigation() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-screen]')) {
                const screenId = e.target.dataset.screen;
                showScreen(screenId);

                if (screenId === 'exercises-screen') {
                    this.loadExercises();
                } else if (screenId === 'workouts-screen') {
                    this.loadWorkouts();
                } else if (screenId === 'summaries-screen') {
                    this.loadSummaries();
                } else if (screenId === 'login-screen') {
                    authService.logout();
                }
            }
        });
    }

    checkAuthStatus() {
        if (authService.isAuthenticated()) {
            showScreen('dashboard-screen');
            this.loadExercises();
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
            showScreen('dashboard-screen');
            this.loadExercises();
        } catch (error) {
            showError('login-error', error.message);
        }
    }

    async handleCreateExercises(e) {
        const formData = new FormData(e.target);
        const exerciseData = {
            name: formData.get('name'),
            tool: formData.get('tool')
        };

        try {
            await exerciseService.createExercises(exerciseData);
            e.target.reset();
            this.loadExercises();
        } catch (error) {
            console.error('Failed to create exercise:', error);
        }
    }

    async loadExercises() {
        try {
            const exercises = await exerciseService.getExercises();
            renderExercises(exercises, 'exercises-list');
        } catch (error) {
            console.error('Failed to load exercises:', error);
        }
    }

    async loadWorkouts() {
        try {
            const workouts = await workoutService.getWorkouts();
            renderWorkouts(workouts, 'workouts-list');
        } catch (error) {
            console.error('Failed to load workouts:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WorkoutApp();
});

