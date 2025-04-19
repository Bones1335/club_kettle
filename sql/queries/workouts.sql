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

-- name: GetWorkoutRoutineExercises :many
SELECT * FROM workout_exercises
WHERE workout_id = $1;
/*
-- name: CreateRound :one
INSERT INTO rounds (
    id,
    round_number,
    reps_completed,
    workout_exercise_id
)
VALUES (
    gen_random_uuid(),
    $1,
    $2,
    $3
)
RETURNING *;

-- name: CreateWorkoutSummary :one
INSERT INTO workout_summary (
    workout_exercise_id,
    total_reps,
    work_capacity
)
VALUES (
    $1,
    $2,
    $3
)
RETURNING *;
*/