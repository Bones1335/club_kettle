
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

