-- name: CreateWorkout :one
INSERT INTO workouts (
    id,
    name,
    description,
    total_duration,
    user_id
)
VALUES (
    gen_random_uuid(),
    $1,
    $2,
    $3,
    $4
)
RETURNING *;

-- name: CreateWorkoutExercise :one
INSERT INTO workouts_exercises (
    id,
    time_seconds,
    weight_kg,
    workout_id,
    exercise_id
)
VALUES (
    gen_random_uuid(),
    $1,
    $2,
    $3,
    $4
)
RETURNING *;

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