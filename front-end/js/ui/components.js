import { exerciseService } from "../services/exercises.js";
import { workoutService } from "../services/workouts.js";

export function createExerciseCard(exercise) {
    return `
        <div class="card" data-exercise-id=${exercise.id}>
            <h3>${exercise.name}</h3>
            <p><strong>Tool:</strong> ${exercise.tool}</p>
            <button class="btn btn-danger" data-exercise-id=${exercise.id}>
                Delete
            </button>
        </div>
    `;
}

export function createWorkoutCard(workout) {
      return `
        <div class="card" data_workout_id=${workout.id}>
            <h3>${workout.name}</h3>
            <p>${workout.description || 'No description'}</p>
            <button class="btn btn-view" data-workout-id=${workout.id} onclick="showWorkoutDetails('${workout.id}')">View Workout</button>
            <button class="btn btn-danger" data-workout-id=${workout.id}>
                Delete
            </button>
        </div>
    `;
}

export function renderExercises(exercises, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return ;

    container.innerHTML = exercises.map(createExerciseCard).join('');

    const deleteButtons = container.querySelectorAll('.btn-danger');
    deleteButtons.forEach(button => {
        button.addEventListener('click',  async (e) => {
            e.preventDefault();

            const exerciseId = e.target.dataset.exerciseId;

            try {
                await exerciseService.deleteExercise(exerciseId);
                const card = e.target.closest('.card');
                if (card) {
                    card.remove();
                }
            } catch (error) {
                console.error('Failed to delete exercise:', error);
            }
        });
    });
}

export function renderWorkouts(workouts, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return ;

    container.innerHTML = workouts.map(createWorkoutCard).join('');
    const deleteButtons = container.querySelectorAll('.btn-danger');
    deleteButtons.forEach(button => {
        button.addEventListener('click',  async (e) => {
            e.preventDefault();

            const workoutId = e.target.dataset.workoutId;

            try {
                await workoutService.deleteWorkout(workoutId);
                const card = e.target.closest('.card');
                if (card) {
                    card.remove();
                }
            } catch (error) {
                console.error('Failed to delete workout:', error);
            }
        });
    });
}

function createExerciseOptions(exercises) {
    let options = '<option value="">Select an exercise...</option>';

    exercises.forEach(exercise => {
        options += `<option value="${exercise.id}">${exercise.name} (${exercise.tool})</option>`
    });

    return options;
}

export function addExercise(exercises, exerciseCount) {
    const exerciseSelector = document.getElementById('exercise-selector');

    const exerciseDiv = document.createElement('div');
    exerciseDiv.className = 'exercise-item';
    exerciseDiv.id = `exercise-${exerciseCount}`;

    exerciseDiv.innerHTML = `
        <select name="exercise-${exerciseCount}" id="workoutExercise${exerciseCount}" required>
            ${createExerciseOptions(exercises)}
        </select>
        <button type="button" class="btn btn-danger" id="remove-exercise-${exerciseCount}">Remove</button>
    `;

    exerciseSelector.appendChild(exerciseDiv);

    let removeExerciseBtn = document.getElementById(`remove-exercise-${exerciseCount}`);
    removeExerciseBtn.addEventListener('click', () => {
        removeExercise(exerciseDiv.id);
    });

}

export function removeExercise(id) {
    const exerciseDiv = document.getElementById(id);
    if (exerciseDiv) {
        exerciseDiv.remove();
    }
}

export function renderWorkoutOptions(workouts, workoutSelectorName) {
    const workoutSelector = document.getElementById(workoutSelectorName);

    let options = '<option value="">Select a workout...</option>';

    workouts.forEach(workout => {
        options += `<option value="${workout.id}">${workout.name}</option>`
    });

    workoutSelector.innerHTML = options;
}

export function renderExercisesForSelectedWorkout(workout, tableName) {
    const tableSelect = document.getElementById(tableName);
    if (tableSelect.textContent.length > 0) {
        tableSelect.textContent = "";
    }

    const tableHead = document.createElement('thead');
    const tableBody = document.createElement('tbody');

    for (let i = 0; i < workout.Workout.rounds_per_exercise + 1; i++) {
        let tableHeader = document.createElement('th');

        if (i > 0) {
            tableHeader.innerText = `Round ${i}`;
            tableHead.append(tableHeader);
            continue;
        }

        tableHeader.innerText = 'Exercises';
        tableHead.append(tableHeader);
    }
    tableSelect.append(tableHead);

    for (let i = 0; i < workout.Exercises.length; i++) {
        let tableRow = document.createElement('tr');

        for (let j = 0; j < workout.Workout.rounds_per_exercise + 1; j++) {
            let tableData = document.createElement('td');

            if (j > 0) {
                const input = document.createElement('input');
                input.type = 'number';
                input.name = `ex${i}rd${j}`;

                tableData.appendChild(input);
            } else {
                tableData.id = `${workout.Exercises[i].id}`;
                tableData.innerText = `${workout.Exercises[i].name}`;
            }

            tableRow.append(tableData);
        }

        tableBody.append(tableRow);
    }
    tableSelect.append(tableBody);
}