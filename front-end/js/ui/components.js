export function createExerciseCard(exercise) {
    return `
        <div class="card" data-exercise-id=${exercise.id}">
            <h3>${exercise.name}</h3>
            <p><strong>Type:</strong> ${exercise.tool}</p>
            <button class="btn btn-danger" onclick="deleteExercise('${exercise.id}')">
                Delete
            </button>
        </div>
    `;
}

export function renderExercises(exercises, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return ;

    container.innerHTML = exercises.map(createExerciseCard).join('');
}