-- name: CreateWorkoutRoutine :one
INSERT INTO workout_routines (
    id,
    name,
    description,
    total_duration,
    rounds_per_exercise,
    round_duration,
    rest_duration
)
VALUES (
    gen_random_uuid(),
    $1,
    $2,
    $3,
    $4,
    $5,
    $6
)
RETURNING *;

-- name: AddExerciseToWorkout :one
INSERT INTO workout_exercises (
    id,
    workout_id,
    exercise_id,
    position
)
VALUES (
    gen_random_uuid(),
    $1,
    $2,
    $3
)
RETURNING *;

-- name: GetWorkoutRoutines :many
SELECT * FROM workout_routines;

-- name: GetSingleWorkoutRoutine :one
SELECT * FROM workout_routines
WHERE id = $1;

-- name: GetWorkoutRoutineExercises :many
SELECT * FROM workout_exercises
WHERE workout_id = $1;

-- name: UpdateWorkoutRoutines :one
UPDATE workout_routines SET name = $2, description = $3, total_duration = $4, rounds_per_exercise = $5, round_duration = $6, rest_duration = $7
WHERE id = $1
RETURNING *;

-- name: UpdateWorkoutExercises :one
UPDATE workout_exercises SET position = $2
WHERE workout_id = $1
RETURNING *;

-- name: DeleteWorkoutRoutines :exec
DELETE FROM workout_routines
WHERE id = $1;

-- name: CreateRound :one
INSERT INTO rounds (
    id,
    date,
    round_number,
    reps_completed,
    workout_exercise_id
)
VALUES (
    gen_random_uuid(),
    $1,
    $2,
    $3,
    $4
)
RETURNING *;

-- name: CreateWorkoutSummaries :one
INSERT INTO workout_summaries (
    workout_exercise_id,
    date,
    weight_in_kg,
    workout_number,
    total_reps,
    work_capacity
)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6
)
RETURNING *;

-- name: GetWorkoutSummaries :many
SELECT * FROM workout_summaries;