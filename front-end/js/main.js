import { authService } from "./services/auth.js";
import { exerciseService } from "./services/exercises.js";
import { initializeWorkoutTimer } from "./services/timer.js";
import { WorkoutService, workoutService } from "./services/workouts.js";
import { addExercise, renderExercises, renderExercisesForSelectedWorkout, renderWorkoutOptions, renderWorkouts, renderWorkoutSummaries } from "./ui/components.js";
import { modalManager, modalTemplates } from "./ui/modals.js";
import { showScreen, showError, clearError } from "./ui/screens.js";

class WorkoutApp {
    constructor() {
        this.modalManager = modalManager;
        this.modalTemplates = modalTemplates;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupModalEventListeners();
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

        document.getElementById('active-workout-selector').addEventListener('click', async (e) => {
            e.preventDefault();
            await this.handleSelectedWorkout(e);
        })

        document.getElementById('active-workout-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmitFinishedWorkout(e);
        });

        this.setupNavigation();
    }

    setupModalEventListeners() {
        document.addEventListener('showWorkoutDetails', (e) => {
            this.handleShowWorkoutDetails(e.detail);
        });
    }

    setupNavigation() {
        document.addEventListener('click', async (e) => {
            if (e.target.matches('[data-screen]')) {
                const screenId = e.target.dataset.screen;
                showScreen(screenId);

                if (screenId === 'exercises-screen') {
                    this.loadExercises();
                } else if (screenId === 'workouts-screen') {
                    let exerciseCount = 0;
                    let exercises = await exerciseService.getExercises();

                    addExercise(exercises, exerciseCount++);

                    let addExerciseBtn = document.getElementById('add-exercise');
                    addExerciseBtn.addEventListener('click', () => {
                        addExercise(exercises, exerciseCount++);
                    });

                    this.loadWorkouts();
                } else if (screenId === 'summaries-screen') {
                    this.loadSummaries();
                } else if (screenId === 'active-workouts-screen') {
                    this.loadActiveWorkout();
                } else if (screenId === 'login-screen') {
                    authService.logout();
                }
            }
        });
    }

    async handleShowWorkoutDetails(workoutId) {
        const workout = await workoutService.getWorkout(workoutId);
        this.modalTemplates.showWorkoutDetails(workout);
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

    async handleCreateWorkout(e) {
        const formData = new FormData(e.target);

        const exerciseElements = document.querySelectorAll('#exercise-selector [name^="exercise-"]');
        const exercises = [];

        exerciseElements.forEach(element => {
            const exerciseValue = element.value;
            if (exerciseValue) {
                exercises.push(exerciseValue);
            }
        });

        const workoutData = {
            name: formData.get('name'),
            description: formData.get('workout_description'),
            total_duration: parseInt(formData.get('total_duration')),
            rounds_per_exercise: parseInt(formData.get('rounds_per_exercise')),
            round_duration: parseInt(formData.get('round_duration')),
            rest_duration: parseInt(formData.get('rest_duration')),
            exercises: exercises
        }

        try {
            await workoutService.createWorkouts(workoutData);
            e.target.reset();
            this.loadWorkouts();

        } catch (error) {
            console.error('Failed to create workout:', error);
        }
    }

    async handleSelectedWorkout(e) {
        const selector = document.getElementById('active-workout-name');
        const selectedWorkoutId = selector.value;

        if (!selectedWorkoutId) {
            alert('please select a workout');
            return;
        }

        try {
            const selectedWorkout = await workoutService.getWorkout(selectedWorkoutId);

            const timerContainer = document.getElementById('timer-container');
            renderExercisesForSelectedWorkout(selectedWorkout, 'active-workout-table-data');
            initializeWorkoutTimer(timerContainer, selectedWorkout.Workout);
        } catch (error) {
            console.error('Failed to select workout', error);
        }
    }

    async handleSubmitFinishedWorkout(e) {
        const formData = new FormData(e.target);
        const workout_summary = {
            date: new Date(formData.get("date")).toISOString(),
            weight_in_kg: parseInt(formData.get("weight")),
            workout_number: parseInt(formData.get("active-workout-number")),
            workout_routine_id: formData.get("active-workout-name"),
        };

        const rounds = [];
        let table = document.getElementById("active-workout-table-data");
        for (let i = 0; i < table.rows.length; i++) {       
                let row = table.rows[i];
                for (let j = 0; j < row.cells.length - 1; j++) {
                    rounds.push({
                        date: new Date(formData.get("date")).toISOString(),
                        round_number: j+1,
                        reps_completed: parseInt(formData.get(`ex${i}rd${j+1}`)),
                        workout_exercise_id: row.cells[0].id,
                    });
                };
        }

        const summary = {
            rounds: rounds,
            workout_summary: workout_summary,
        }
        try {
            workoutService.createWorkoutSummary(summary);
            e.target.reset();
            this.loadSummaries();
        } catch (error) {
            console.error('Failed to submit finished workout data', error);
        }
    }

    async loadActiveWorkout() {
        try {
            const workouts = await workoutService.getWorkouts();
            renderWorkoutOptions(workouts, 'active-workout-name');
        } catch (error) {
            console.error('Failed to load workout names', error);
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

    async loadSummaries() {
        try {
            const summaries = await workoutService.getWorkoutSummaries();
            console.log(summaries);
            renderWorkoutSummaries(summaries, 'workout-summaries');
        } catch (error) {
            console.error('Failed to load summaries', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new WorkoutApp();

    window.workoutApp = app;

    window.showWorkoutDetails = (workoutId) => {
        app.handleShowWorkoutDetails(workoutId);
    };
});

