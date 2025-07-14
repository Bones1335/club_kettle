
export function createExerciseCard(exercise) {
    return `
        <div class="card" data-exercise-id=${exercise.id}>
            <h3>${exercise.name}</h3>
            <p><strong>Tool:</strong> ${exercise.tool}</p>
            <button class="btn btn-danger" onclick="deleteExercise('${exercise.id}')">
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
            <button class="btn details">View Workout</button>
        </div>
    `;
}

export function renderExercises(exercises, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return ;

    container.innerHTML = exercises.map(createExerciseCard).join('');
}

export function renderWorkouts(workouts, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return ;

    container.innerHTML = workouts.map(createWorkoutCard).join('');
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